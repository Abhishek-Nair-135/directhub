import { Octokit } from "octokit";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";

let user = "";
const MyOctokit = Octokit.plugin(restEndpointMethods);
const octokit = new MyOctokit({
    auth: "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",
});

octokit.rest.users.getAuthenticated().then(({ data: { login } }) => {
    user = login;
});

export { octokit, user };
