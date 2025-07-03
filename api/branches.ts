import HTTP from "./http";

export default class BranchAPI {
  constructor(private httpservice: HTTP, public config: IGitHubApi) {}

  public async create(name: string, sha?: string): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/git/refs`
    );

    const body = {
      ref: `refs/heads/${name}`,
      sha: sha,
    };

    return this.httpservice.post(url, body);
  }

  public async delete(name: string): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/git/refs/heads/${name}`
    );

    return this.httpservice.delete(url);
  }

  public async list(): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/branches`
    );

    return this.httpservice.get(url);
  }

  public async get(name: string): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/branches/${name}`
    );

    return await this.httpservice.get(url);
  }

  public async getDefaultBranch(): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}`
    );

    return await this.httpservice.get(url);
  }
}