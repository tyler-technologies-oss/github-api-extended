interface IGitHubApi {
  version: string;
  url: string;
  token: string;
  repository?: IRepository;
}

interface IRepository {
  name: string;
  owner: string;
}

interface IResult {
  result?: object;
  error?: string;
  documentation_url?: string;
  status?: number;
}

interface IUpdateRelease {
  releaseId: number;
  tag_name: string;
  target_commitish: string;
  body: string;
  name: string;
  prerelease: boolean;
  make_latest: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface IObject {
  [key: string]: any;
}

interface ICreateRelease {
  tag_name: string;
  target_commitish?: string;
  body?: string;
  name?: string;
  prerelease?: boolean;
  draft?: boolean;
  discussion_category_name?: string;
  generate_release_notes?: boolean;
  make_latest?: string;
}

interface ICreateTag {
  tag: string;
  message: string;
  object: string;
  type: string;
  tagger: {
    name: string;
    email: string;
    date: string;
  };
}