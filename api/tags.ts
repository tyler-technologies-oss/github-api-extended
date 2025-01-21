import HTTP from "./http";

export default class TagAPI {
  constructor(private httpservice: HTTP, public config: IGitHubApi) {}

  public list(): Promise<IObject[]> {
    let page = 1;
    let tags: IObject[] = [];

    const url = new URL(
        `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/tags`
        );

        return new Promise((resolve) => {
            const fetch = async () => {
              url.searchParams.set("page", page.toString());
                const response = await this.httpservice.get(url);
                if (response.data.length === 0) {
                    resolve(tags);
                } else {
                    tags.push(...(response.data as IObject[]));
                    page++;
                    fetch();
                }
            }
            fetch();
        });
    }

    public create(tag: ICreateTag): Promise<IObject> {
        const url = new URL(
            `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/tags`
        );
        return this.httpservice.post(url, tag);
    }

    public delete(tag: string): Promise<IObject> {
        const url = new URL(
            `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/tags/${tag}`
        );
        return this.httpservice.delete(url);
    }

    public get(tag: string): Promise<IObject> {
        const url = new URL(
            `${this.config.url}/repos/${this.config.repository?.owner}/${this.config.repository?.name}/tags/${tag}`
        );
        return this.httpservice.get(url);
    }
}