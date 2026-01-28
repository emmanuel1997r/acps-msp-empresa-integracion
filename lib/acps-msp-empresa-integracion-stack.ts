import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class AcpsMspEmpresaGestionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const config: any = props?.tags;

    // Importar la VPC existente
    const vpc = ec2.Vpc.fromLookup(this, "ExistingVpc", {
      vpcId: config.VPC_ID,
    });

    // Subnets en diferentes zonas
    const subnet1 = ec2.Subnet.fromSubnetAttributes(this, "Subnet1", {
      subnetId: config.MID_SNID_1A,
      availabilityZone: "us-east-1a",
    });

    const subnet2 = ec2.Subnet.fromSubnetAttributes(this, "Subnet2", {
      subnetId: config.MID_SNID_1B,
      availabilityZone: "us-east-1b",
    });

    const subnet3 = ec2.Subnet.fromSubnetAttributes(this, "Subnet3", {
      subnetId: config.MID_SNID_1C,
      availabilityZone: "us-east-1c",
    });

    // Políticas IAM
    const vpcPolicy = new iam.PolicyStatement({
      actions: [
        "ec2:DescribeNetworkInterfaces",
        "ec2:CreateNetworkInterface",
        "ec2:DeleteNetworkInterface",
        "ec2:DescribeInstances",
        "ec2:AttachNetworkInterface",
      ],
      resources: ["*"],
    });

    const cloudwatchPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["logs:*"],
      resources: ["*"],
    });

    const secretsManagerPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["secretsmanager:*"],
      resources: ["*"],
    });

    // Rol IAM para lambdas
    const lambdaRole = new iam.Role(this, `MyRole`, {
      roleName: `${this.stackName}-role-stack`,
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });

    lambdaRole.addToPolicy(vpcPolicy);
    lambdaRole.addToPolicy(cloudwatchPolicy);
    lambdaRole.addToPolicy(secretsManagerPolicy);

    // Configuración común de lambdas
    const LAMBDA_CONFIGURATION: NodejsFunctionProps = {
      bundling: {
        minify: true,
        externalModules: ["aws-sdk"],
      },
      runtime: lambda.Runtime.NODEJS_22_X,
      tracing: lambda.Tracing.ACTIVE, // Habilitar X-Ray
      logRetention: RetentionDays.ONE_MONTH,
      memorySize: 1024,
      role: lambdaRole,
      vpc: vpc,
      vpcSubnets: { subnets: [subnet1, subnet2, subnet3] },
      timeout: cdk.Duration.seconds(30),
    };

    // LAMBDAS
    const empresaActualizarFn = new NodejsFunction(this, `empresa-actualizar`, {
      functionName: `${this.stackName}-empresa-actualizar`,
      entry: path.join(__dirname, `/../src/fn-empresa-actualizar/index.ts`),
      handler: "handler",
      ...LAMBDA_CONFIGURATION,
    });

    const empresaCuentaCrearFn = new NodejsFunction(
      this,
      `empresa-cuenta-crear`,
      {
        functionName: `${this.stackName}-empresa-cuenta-crear`,
        entry: path.join(__dirname, `/../src/fn-empresa-cuenta-crear/index.ts`),
        handler: "handler",
        ...LAMBDA_CONFIGURATION,
      },
    );

    const estadoCuentaFn = new NodejsFunction(this, `estado-cuenta`, {
      functionName: `${this.stackName}-estado-cuenta`,
      entry: path.join(__dirname, `/../src/fn-estado-cuenta/index.ts`),
      handler: "handler",
      ...LAMBDA_CONFIGURATION,
    });

    const representanteLegalFn = new NodejsFunction(
      this,
      `representante-legal`,
      {
        functionName: `${this.stackName}-representante-legal`,
        entry: path.join(
          __dirname,
          `/../src/fn-representante-legal-firmante/index.ts`,
        ),
        handler: "handler",
        ...LAMBDA_CONFIGURATION,
      },
    );

    const notificacionClienteFn = new NodejsFunction(
      this,
      `notificacion-cliente`,
      {
        functionName: `${this.stackName}-notificacion-cliente`,
        entry: path.join(__dirname, `/../src/fn-notificacion-cliente/index.ts`),
        handler: "handler",
        ...LAMBDA_CONFIGURATION,
      },
    );

    // 1. Cognito User Pool
    const userPool = cognito.UserPool.fromUserPoolId(
      this,
      "ExistingUserPool",
      config.COGNITO_ID,
    ); // VARIABLE TIENE QUE SER DEFINIDA EN EL CONTEXTO DE CDK

    // 2. Cognito Authorizer
    const cognitoAuthorizer = new apigateway.CognitoUserPoolsAuthorizer(
      this,
      "CognitoAuthorizer",
      {
        cognitoUserPools: [userPool],
        identitySource: "method.request.header.Authorization",
        authorizerName: "bb-contactcenter-cognitor-autorizer", //Tiene que ser modificado por el verdadero
      },
    );

    // 3. API Gateway
    const api = new apigateway.RestApi(this, "apiGateway", {
      restApiName: `${this.stackName}`,
      endpointConfiguration: { types: [apigateway.EndpointType.REGIONAL] },
      deployOptions: {
        tracingEnabled: true,
        stageName: `${config.STAGE}`,
      },
    });

    cognitoAuthorizer._attachToApi(api);

    const authScope = config.COGNITO_SCOPE;
    const optionsWithAuth: apigateway.MethodOptions = {
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizer: cognitoAuthorizer,
      authorizationScopes: [`${authScope}`],
      apiKeyRequired: false,
    };
    // API Resources y Methods
    const empresaResource = api.root.addResource("empresa");

    // Endpoints
    empresaResource
      .addResource("actualizar-empresa")
      .addMethod(
        "PATCH",
        new apigateway.LambdaIntegration(empresaActualizarFn),
        optionsWithAuth,
      );

    empresaResource
      .addResource("cuenta-crear")
      .addMethod(
        "POST",
        new apigateway.LambdaIntegration(empresaCuentaCrearFn),
        optionsWithAuth,
      );

    empresaResource
      .addResource("estado-cuenta")
      .addMethod(
        "POST",
        new apigateway.LambdaIntegration(estadoCuentaFn),
        optionsWithAuth,
      );

    empresaResource
      .addResource("representante-legal")
      .addMethod(
        "POST",
        new apigateway.LambdaIntegration(representanteLegalFn),
        optionsWithAuth,
      );

    empresaResource
      .addResource("notificacion-cliente")
      .addMethod(
        "POST",
        new apigateway.LambdaIntegration(notificacionClienteFn),
        optionsWithAuth,
      );
    // Permisos API Gateway
    [
      empresaActualizarFn,
      empresaCuentaCrearFn,
      estadoCuentaFn,
      representanteLegalFn,
      notificacionClienteFn,
    ].forEach((fn, index) => {
      fn.addPermission(`ApiGatewayInvokePermission${index}`, {
        principal: new iam.ServicePrincipal("apigateway.amazonaws.com"),
        sourceArn: api.arnForExecuteApi(),
      });
    });
  }
}
