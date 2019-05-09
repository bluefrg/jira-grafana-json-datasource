# Jira Grafana JSON Datasource Plugin
### Connect Grafana to Jira Cloud to retrieve metrics on your Jira issues.

The original intention for this project was to allow me to show a singlestat count of open issues for my team's Jira Service Desk.

![Example](https://preview.ibb.co/hD2txU/screenshot_2018_09_23_094255.png)

## Requirements
This project only requires your Grafana instance to have the [SimpleJson plugin](https://grafana.com/plugins/grafana-simple-json-datasource/installation) installed.

## Installation

Run the Docker container (replace environment variables with your Jira Cloud credentials):
```bash
$ docker run -d -p 3000:3000 --name jira-grafana -e JIRA_HOST=myjira.atlassian.net -e JIRA_USER=mike@bluefrog.ca -e JIRA_PASS=XXXX bluefrg/jira-grafana-json-datasource
```

Confirm running by visiting: http://localhost:3000

*Note: This project has only been tested locally, and as a ECS task using Jira Cloud. Jira On-Prem is not supported by the dependencies used in this project.*

### Atlassian credentials
It's recommended to use API tokens from your [Atlassian API token page](https://id.atlassian.com/manage/api-tokens) for authentication instead of your primary account username and password.

### Testing Jira connection
You can validate the connection to Jira is authenticating properly by visiting the `test-jira` endpoint at: http://localhost:3000/test-jira

A successful authentication will return the current user, a failure will return the HTTP response and detailed error message from Jira.

### docker-compose.yml
The docker-compose is included as an example of how to test Grafana and  the Jira Grafana JSON Datasource integration. Not intended for production use.

## Setup
To add this as a data source in Grafana, go to Configuration -> Data Sources and click Add. For the Type choose SimpleJson. Enter the root URL for this project (e.g. http://localhost:3000).

When adding a panel to a dashboard, choose the newly created data source. Under the metrics tab, you will see your Jira filters as an option to plot on your panel.

![Example](https://thumb.ibb.co/fxS7rp/screenshot_2018_09_23_093243.png)

### Authentication
You can require authentication by adding a `HTTP_USER` and `HTTP_PASS` environment variable.

You will need to reconfigure your data source to use "Basic Auth".

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
