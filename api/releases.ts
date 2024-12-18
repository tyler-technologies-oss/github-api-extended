import HTTP from "./http";

export default class ReleaseAPI {
  constructor(private httpservice: HTTP, public config: IGitHubApi) {}

  public getLatest(): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/releases/latest`
    );
    return this.httpservice.get(url);
  }

  public getByTag(tag: string): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/releases/tags/${tag}`
    );
    return this.httpservice.get(url);
  }

  public async getLatestByTagPrefix(
    prefix: string,
    prerelease: boolean
  ): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/releases`
    );
    const response = await this.httpservice.get(url);
    const releases = response.data;
    return releases.find(
      (r: IObject) =>
        r.tag_name.startsWith(prefix) && r.prerelease == prerelease
    );
  }

  public compare(
    previousRelease: string,
    currentRelease: string
  ): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/compare/${previousRelease}...${currentRelease}`
    );
    return this.httpservice.get(url);
  }

  public generateNotes(
    tag_name: string,
    previous_tag_name: string,
    target_commitish: string
  ): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/releases/generate-notes`
    );
    const body = {
      tag_name,
      previous_tag_name,
      target_commitish,
    };

    return this.httpservice.post(url, body);
  }

  public searchNotes(regex: RegExp, compare: IObject): string[] {
    const results = compare.commits
      .map((commit: IObject) => commit.commit.message.match(regex))
      .flat()
      .filter(Boolean)
      .sort()
      .filter(
        (item: string, index: number, arr: string[]) =>
          arr.indexOf(item) === index
      );
    return results;
  }

  public sortNotes(issues: string[]): string[] {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const filtered = issues.reduce((acc: any, curr: string) => {
      const key = curr.split("-")[0];
      acc[key] = acc[key] || [];
      acc[key].push(curr);
      return acc;
    }, {});
    return filtered;
  }

  public update(release: IUpdateRelease): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/releases/${release.releaseId}`
    );
    return this.httpservice.patch(url, release);
  }

  public create(release: ICreateRelease): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/releases`
    );
    return this.httpservice.post(url, release);
  }
}
