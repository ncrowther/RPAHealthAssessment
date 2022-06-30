var fs = require('fs')
var request = require('request')
const axios = require('axios')
const https = require('https')

const axiosNoSSLCheckInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})

console.log('POST upload health assessment to CM...')

const sourceFilepath = 'D:\\A_Consultancy\\Presales\\nedbank'
const sourceFilename = process.argv[2] // script param 1
var destinationFolder = 'test'
destinationFolder = ' \\"/TECHSALES HOME DIRECTORY/Nigel/' + destinationFolder + '\\" '
var destinationFilename = process.argv[2]
destinationFilename = ' \\"' + destinationFilename + '\\" '
const fullSourcePath = sourceFilepath + '\\' + sourceFilename

const graphqlFileInfo = '{"query":"mutation ($contvar:String) {createDocument(repositoryIdentifier:\\"OS1\\" fileInFolderIdentifier: ' +
destinationFolder +
'documentProperties: {name: ' +
  destinationFilename +
  'contentElements:{replace: [{type: CONTENT_TRANSFER contentType: \\"application/vnd.openxmlformats-officedocument.wordprocessingml.document\\" subContentTransfer: {content:$contvar} }]} } checkinAction: {} ) { id name } }", "variables":{"contvar":null} }'

// console.log('graphqlFileInfo: ' + graphqlFileInfo)

// API calls
const navigatorURL = 'https://demo-emea-01.automationcloud.ibm.com/dba/dev/content-services-graphql/graphql'
var options = {
  method: 'POST',
  url: navigatorURL,
  headers: {
    Authorization: 'Basic Z3JhcGhxbF9uaWdlbC5maWRAdDc5MjA6WEQ3WVFPVVg2d0ZtcDR2SHRraTR6ZjBBTE1GeFJaSXFmbVVDZEZsYg=='
  },
  formData: {
    graphql: graphqlFileInfo,
    contvar: {
      value: fs.createReadStream(`${fullSourcePath}`),
      options: {
        filename: `${destinationFilename}`,
        contentType: null
      }
    }
  }
}
request(options, function (error, response) {
  if (error) {
    const errorResponse = { response: '99: Error in upload: ' + error }
    console.log(errorResponse)
  } else {
    const responseStr = 'File ' + fullSourcePath + ' uploaded to ' + navigatorURL + '/' + destinationFolder
    const returnResponse = { response: responseStr }
    console.log(returnResponse)
  }
})
