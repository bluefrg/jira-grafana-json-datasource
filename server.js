const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const JiraClient = require('jira-connector')

const jira = new JiraClient({
  host: process.env.JIRA_HOST,
  basic_auth: {
    username: process.env.JIRA_USER,
    password: process.env.JIRA_PASS
  }
})

app.use(bodyParser.json())


app.get('/', (httpReq, httpRes) => {
  httpRes.send('OK')
})


app.all('/search', (httpReq, httpRes) => {

  jira.makeRequest({
    uri: jira.buildURL('/filter')
  }).then((jiraRes) => {
  
    let result = jiraRes.map(filter => {
      return {
        text: filter.name,
        value: filter.id
      }
    })

    httpRes.json(result)
  })
  
})

app.post('/query', (httpReq, httpRes) => {

  let result = []

  // Convert proper formatted Grafana data into the Jira mess
  let from = new Date(httpReq.body.range.from).toISOString().replace(/T/, ' ').replace(/\:([^:]*)$/, '')
  let to = new Date(httpReq.body.range.to).toISOString().replace(/T/, ' ').replace(/\:([^:]*)$/, '')

  let p = httpReq.body.targets.map(target => {

    return jira.search.search({
      jql: 'filter = "' + target.target + '" AND created >= "' + from + '" AND created <= "' + to + '"'
    }).then((jiraRes) => {

      if (target.type == 'timeserie') {
        
        let datapoints = jiraRes.issues.map(issue => {
          timestamp = Math.floor(new Date(issue.fields.created))
          return [1, timestamp]
        })

        result.push({
          target: target.target,
          datapoints: datapoints
        })

      }
      else if (target.type == 'table') {

        let rows = jiraRes.issues.map(issue => {
          return [
            issue.key,
            issue.fields.summary,
            issue.fields.assignee ? issue.fields.assignee.displayName : '',
            issue.fields.status ? issue.fields.status.name : '',
            issue.fields.created
          ]
        })

        result.push({
          columns: [
            { text: 'Key', 'type': 'string' },
            { text: 'Summary', 'type': 'string' },
            { text: 'Assignee', 'type': 'string' },
            { text: 'Status', 'type': 'string' },
            { text: 'Created', 'type': 'time' }
          ],
          type: 'table',
          rows: rows
        })
      }


    })
  })

  // Once all promises resolve, return result
  Promise.all(p).then(() => {
    httpRes.json(result)
  })
  
})

app.listen(3000)

console.log('Server is listening to port 3000')