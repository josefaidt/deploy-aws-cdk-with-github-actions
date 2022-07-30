import 'source-map-support/register.js'
import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { GitHubActions } from './github-actions'
import { pkg } from './pkg'

const app = new cdk.App({
  context: {
    name: 'githubactions',
    version: pkg.version,
  },
})

export class Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    /**
     * Tag the resources with the version of this project
     */
    cdk.Tags.of(this).add('version', this.node.tryGetContext('version'))

    /**
     * Create the GitHub Actions construct with our repo name
     */
    new GitHubActions(this, 'GitHubActions', {
      repo: 'josefaidt/*',
    })
  }
}

new Stack(app, 'Stack', {
  stackName: `${app.node.tryGetContext('name')}`,
})
