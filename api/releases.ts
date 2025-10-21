import HTTP from "./http";

export default class ReleaseAPI {
  constructor(private httpservice: HTTP, public config: IGitHubApi) {}

  public async getLatest(prerelease?: boolean): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/releases`
    );

    prerelease = prerelease || false;

    const response = await this.httpservice.get(url);

    // Sort by published date because github api may not return the latest release first due to string comparison
    const releases = Array.isArray(response?.data) ? response.data.sort(
      (a: IObject, b: IObject) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    ) : [];

    return releases?.find((r: IObject) => r.prerelease == prerelease);
  }

  public getByTag(tag: string): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/releases/tags/${tag}`
    );
    return this.httpservice.get(url);
  }

  public async getLatestByTagPrefix(
    prefix: string,
    prerelease?: boolean
  ): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/releases`
    );

    prerelease = prerelease || false;

    const response = await this.httpservice.get(url);
    
    // Sort by published date because github api may not return the latest release first due to string comparison
    const releases = Array.isArray(response?.data) ? response.data.sort(
      (a: IObject, b: IObject) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    ) : [];
    
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
    const results = compare?.commits
      ?.map((commit: IObject) => commit?.commit?.message?.match(regex))
      .flat()
      .filter(Boolean)
      .sort()
      .filter(
        (item: string, index: number, arr: string[]) =>
          arr.indexOf(item) === index
      ) || [];
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

  public list(): Promise<IObject> {
    let page = 1;
    const releases: IObject[] = [];
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/releases`
    );

    return new Promise((resolve) => {
      const fetch = async () => {
        url.searchParams.set("page", page.toString());
        const response = await this.httpservice.get(url);
        if (response?.data?.length === 0) {
          resolve(releases);
        } else {
          releases.push(...(response.data as IObject[]));
          page++;
          fetch();
        }
      };
      fetch();
    });
  }

  public async listByTagPrefix(prefix: string): Promise<IObject> {
    const releases = await this.list();
    return releases.filter((r: IObject) => r.tag_name.startsWith(prefix));
  }

  public delete(releaseId: number): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/releases/${releaseId}`
    );
    return this.httpservice.delete(url);
  }

  public async deleteByTag(tag: string): Promise<IObject> {
    const release = await this.getByTag(tag) as IObject;
    if (!release) {
      throw new Error(`Release with tag ${tag} not found`);
    }
    return this.delete(release.data.id);
  }

  public async notes(tag: string): Promise<IObject> {
    const url = new URL(
      `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/releases/tags/${tag}`
    );
    const response = await this.httpservice.get(url);
    return (response?.data as IObject)?.body;
  }
}
