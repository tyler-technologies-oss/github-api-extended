export default class HTTP {
  private headers: Headers;

  public constructor(public config: IGitHubApi) {
    this.headers = new Headers({
      Authorization: `Bearer ${this.config.token}`,
      "X-GitHub-Api-Version": this.config.version,
    });
  }

  private async request(
    url: URL,
    method: string,
    body?: IObject | string
  ): Promise<{ data: IObject, headers: Headers }> {
    const result = await fetch(url.toString(), {
      method: method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await result.json();
    const headers = result.headers;

    if (!result.ok) {
      console.log(url.toString());
      console.log(headers);
      throw new Error(`Error ${result.status}: ${data.message}`);
    }

    return { data, headers };
  }

  public get(url: URL): Promise<{ data: IObject, headers: Headers }> {
    return this.request(url, "GET");
  }

  public post(url: URL, body?: IObject): Promise<{ data: IObject, headers: Headers }> {
    return this.request(url, "POST", body);
  }

  public put(url: URL, body?: string): Promise<{ data: IObject, headers: Headers }> {
    return this.request(url, "PUT", body);
  }

  public delete(url: URL): Promise<{ data: IObject, headers: Headers }> {
    return this.request(url, "DELETE");
  }

  public patch(url: URL, body?: IObject): Promise<{ data: IObject, headers: Headers }> {
    return this.request(url, "PATCH", body);
  }
}
