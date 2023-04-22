import { Octokit } from "octokit";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";

let user = "";
const MyOctokit = Octokit.plugin(restEndpointMethods);
const octokit = new MyOctokit({
    auth: process.env.REACT_APP_GITHUB_TOKEN,
});

octokit.rest.users.getAuthenticated().then(({ data: { login } }) => {
    user = login;
});

export { octokit, user };
