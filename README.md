To deploy the AWS CDK infrastructure, you'll first need to bootstrap your AWS environment. Bootstrapping sets up the necessary resources in your AWS account to manage CDK applications. 

---

# AWS Classic Infrastructure With CDK

This repository contains an AWS Cloud Development Kit (CDK) application that deploys a classic infrastructure setup in Amazon Web Services (AWS). The setup includes an Amazon Virtual Private Cloud (VPC) with public and private subnets, an Auto Scaling Group (ASG) of Amazon Elastic Compute Cloud (EC2) instances, an Application Load Balancer (ALB), and a MySQL database instance on Amazon RDS. This infrastructure can serve as a foundation for various types of web applications.

## Prerequisites

Before deploying this infrastructure, ensure you have the following prerequisites:

1. [AWS CLI](https://aws.amazon.com/cli/): Ensure you have the AWS Command Line Interface installed and configured with your AWS credentials.

2. [AWS CDK](https://aws.amazon.com/cdk/): Install the AWS CDK globally on your system.

   ```bash
   npm install -g aws-cdk --force
   ```

3. [Node.js](https://nodejs.org/): Make sure you have Node.js installed.

4. [TypeScript](https://www.typescriptlang.org/): This CDK application is written in TypeScript, so you need TypeScript installed.

## Bootstrap the CDK Environment

Before deploying your CDK stack, you need to bootstrap your AWS environment. Run the following command to set up the CDK Toolkit in your AWS account:

```bash
cdk bootstrap
```

This command will create the necessary resources, such as an S3 bucket and an IAM role, to manage CDK applications in your AWS account.

## Deploying the Infrastructure

To deploy this infrastructure to your AWS account, follow these steps:

1. Clone this repository to your local machine.

   ```bash
   git clone https://github.com/sabouf1/AWS-Classic-Infrastructure-With-CDK.git
   ```

2. Navigate to the project directory.

   ```bash
   cd AWS-Classic-Infrastructure-With-CDK
   ```

3. Install the project dependencies.

   ```bash
   npm install
   ```

4. Deploy the CDK stack to AWS.

   ```bash
   cdk deploy
   ```

   This command will create the VPC, ASG, ALB, and RDS instance based on the configuration defined in the `CdkappStack` class.

5. After the deployment is complete, the CDK will provide you with an AWS CloudFormation stack name. You can use this stack name to manage your infrastructure using AWS CloudFormation.

## Cleaning Up

To avoid incurring unnecessary charges, make sure to delete the infrastructure when you're done with it. To do this, run the following command:

```bash
cdk destroy
```

This will delete all the AWS resources created by the CDK stack.

## Customization

You can customize this infrastructure by modifying the `CdkappStack` class in the `lib/cdkapp-stack.ts` file. You can adjust parameters such as VPC settings, EC2 instance types, security groups, and more to suit your specific requirements.

## License

This CDK application is provided under the [MIT License](LICENSE). Feel free to modify and adapt it for your needs.

If you encounter any issues or have questions, please open an [issue](https://github.com/sabouf1/AWS-Classic-Infrastructure-With-CDK/issues) on this repository.

---
