import * as aws from "aws-sdk";
import yaml from "js-yaml";

export class BuildConfig {
  private readonly nameStackApplication: string;
  private readonly stage: string = "dev";

  constructor(nameStackApplication: string, stage: string) {
    this.nameStackApplication = nameStackApplication;
    this.stage = stage;
  }

  async getConfig(): Promise<any> {
    try {
      const nameEnvironmentSsm = `/${this.nameStackApplication}/${this.stage}`;
      console.log(
        `### Getting config from SSM Parameter store with name: " +  ${nameEnvironmentSsm}`,
      );
      const ssm = new aws.SSM();
      let ssmResponse: any = await ssm
        .getParameter({
          Name: nameEnvironmentSsm,
        })
        .promise();

      console.log("### ssmResponse.Parameter.value", ssmResponse);
      let unparsedEnv: any = yaml.load(ssmResponse.Parameter.Value);
      console.log("### unparsedEnv", unparsedEnv);

      const buildConfigResponse: any = {
        STAGE: this.stage, // variable by defual, not remove it
        //BASE_URL: this.ensureString(unparsedEnv,"BASE_URL") // example how can added new variable
        COGNITO_ID: this.ensureString(unparsedEnv, "COGNITO_ID"),
        COGNITO_SCOPE: this.ensureString(unparsedEnv, "COGNITO_SCOPE"),
        VPC_ID: this.ensureString(unparsedEnv, "VPC_ID"),
        MID_SNID_1A: this.ensureString(unparsedEnv, "MID_SNID_1A"),
        MID_SNID_1B: this.ensureString(unparsedEnv, "MID_SNID_1B"),
        MID_SNID_1C: this.ensureString(unparsedEnv, "MID_SNID_1C"),
      };
      console.log(`### buildConfig OK ${buildConfigResponse}`);
      return buildConfigResponse;
    } catch (error) {
      console.log("error getConfig", error);
      console.log(`### I can't retrive the SSM Parameter from AWS`);
      return {
        STAGE: this.stage,
      };
    }
  }

  ensureString(object: { [name: string]: any }, propName: string): string {
    if (!object[propName] || object[propName].trim().length === 0)
      throw new Error(propName + " does not exist or is empty");

    return object[propName];
  }
}
