import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Stack } from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import autoscaling = require('aws-cdk-lib/aws-autoscaling');
import elbv2 = require('aws-cdk-lib/aws-elasticloadbalancingv2');



export class CdkappStack extends Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC
    const vpc = new ec2.Vpc(this, 'TheVPC', {
      cidr: '10.20.0.0/16',
      maxAzs: 2, // Use two Availability Zones
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: 'PublicSubnet',
        },
        {
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
          name: 'PrivateSubnet',
        },
      ],
    });

    // Create a security group for EC2 instances in the public subnet
    const ec2PublicSG = new ec2.SecurityGroup(this, 'EC2PublicSecurityGroup', {
      vpc,
      description: 'Allow SSH and HTTP access to EC2 instances in the public subnet',
    });

    ec2PublicSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH from anywhere');
    ec2PublicSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP from anywhere');
    
    
    const asg = new autoscaling.AutoScalingGroup(this, 'ASG', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }),
      
    });

    const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
      vpc,
      internetFacing: true,
      vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
    });

    const listener = alb.addListener('Listener', {
      port: 80,
    });

    listener.addTargets('Target', {
      port: 80,
      targets: [asg],
    });

    listener.connections.allowDefaultPortFromAnyIpv4('Open to the world');
    
    
    // Create an RDS security group
    const dbSG = new ec2.SecurityGroup(this, 'DatabaseSecurityGroup', {
      vpc,
      description: 'Allow database access from EC2 instances',
    });

    dbSG.addIngressRule(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.tcp(3306), 'Allow MySQL from within the VPC');

    // Create an RDS instance
    const dbInstance = new rds.DatabaseInstance(this, 'MyRDSInstance', {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_5_7_40,
      }),
      // instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
      vpc,
      securityGroups: [dbSG],
      // subnetGroup: dbSubnetGroup,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // WARNING: This will delete the RDS instance when the stack is deleted
    });

    // Create an EC2 instance in the public subnet
    const ec2InstancePublic = new ec2.Instance(this, 'EC2InstancePublic', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      securityGroup: ec2PublicSG,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });

    // Create an EC2 instance in the private subnet
    const ec2InstancePrivate = new ec2.Instance(this, 'EC2InstancePrivate', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      securityGroup: ec2PublicSG, // Update this security group as needed
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    });
  }
}

// const app = new cdk.App();
// new CdkappStack(app, 'CdkappStack');
