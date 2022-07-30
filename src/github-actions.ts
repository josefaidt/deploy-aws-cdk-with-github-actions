import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as iam from 'aws-cdk-lib/aws-iam'

export type GitHubActionsProps = {
  /**
   * The owner/name of the repository to authenticate with
   */
  repo: `${string}/${string}`
}

export class GitHubActions extends Construct {
  constructor(scope: Construct, id: string, props: GitHubActionsProps) {
    super(scope, id)

    const { repo } = props

    /**
     * Create an Identity provider for GitHub inside your AWS Account. This
     * allows GitHub to present itself to AWS IAM and assume a role.
     */
    const provider = new iam.OpenIdConnectProvider(
      this,
      'GitHubActionsOidcProvider',
      {
        url: 'https://token.actions.githubusercontent.com',
        clientIds: ['sts.amazonaws.com'],
      }
    )

    /**
     * Create a principal for the OpenID; which can allow it to assume
     * deployment roles.
     */
    const principal = new iam.OpenIdConnectPrincipal(provider).withConditions({
      StringLike: {
        'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
        'token.actions.githubusercontent.com:sub': `repo:${repo}:*`,
      },
    })

    /**
     * Create a deployment role that has short lived credentials. The only
     * principal that can assume this role is the GitHub Open ID provider.
     *
     * This role is granted authority to assume aws cdk roles; which are created
     * by the aws cdk v2.
     */
    const role = new iam.Role(this, 'GitHubActionsRole', {
      assumedBy: principal,
      description:
        'Role assumed by GitHubPrincipal for deploying from CI using AWS CDK',
      roleName: 'github-actions-role',
      maxSessionDuration: cdk.Duration.hours(1),
      inlinePolicies: {
        CdkDeploymentPolicy: new iam.PolicyDocument({
          assignSids: true,
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['sts:AssumeRole'],
              resources: [
                `arn:aws:iam::${cdk.Stack.of(this).account}:role/cdk-*`,
              ],
            }),
          ],
        }),
      },
    })

    /**
     * Set role ARN as an output to capture and set in GitHub as a secret
     */
    new cdk.CfnOutput(this, 'GitHubActionsRoleOutput', {
      value: role.roleArn,
    })
  }
}
