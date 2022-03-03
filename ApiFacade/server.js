const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
var fs = require('fs')
var request = require('request')
const axios = require('axios')
const https = require('https')

const app = express()
const port = process.env.PORT || 3001

const axiosNoSSLCheckInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

function constructResponse (code, type, desc) {
  // Function to return all possible responses following a write to the DB
  const response = {
    out_code: code,
    out_type: type,
    out_message: desc
  }
  return response
}

// API calls
app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' })
})

app.post('/api/healthdata', (req, res) => {
  const systolic = Math.floor((Math.random() * 150) + 50)
  const diastolic = Math.floor((Math.random() * 50) + 50)
  const weight = Math.floor((Math.random() * 200) + 20)
  const height = Math.floor((Math.random() * 100) + 100)
  const bmi = (weight / ((height * height) / 10000)).toFixed(2)

  var gender = 'Male'
  var smoker = 'No'
  var exercise = 'Low'

  var randNo = Math.floor((Math.random() * 10) + 1)
  if (randNo > 5) {
    gender = 'Female'
  }

  randNo = Math.floor((Math.random() * 10) + 1)
  if (randNo > 5) {
    smoker = 'Yes'
  }

  randNo = Math.floor((Math.random() * 10) + 1)
  if (randNo > 5) {
    exercise = 'High'
  }

  console.log(req.body)
  res.send(JSON.stringify({
    bloodPressure: 'Blood Pressure: ' + systolic + '/' + diastolic,
    weight: 'Weight: ' + weight + 'kg',
    height: 'Height: ' + height + 'cm',
    bmi: 'BMI: ' + bmi,
    gender: 'Gender: ' + gender,
    smoker: 'Smoker: ' + smoker,
    exercise: 'Exercise: ' + exercise
  })
  )
})

app.post('/uploadFile', async (req, res) => {
  console.log('POST upload health assessment to CM...')

  const sourceFilepath = req.query.sourceFilePath
  const sourceFilename = req.query.sourceFileName
  var destinationFolder = req.query.destinationFolder // '\\"/TECHSALES HOME DIRECTORY/Nigel\\"
  destinationFolder = ' \\"/TECHSALES HOME DIRECTORY/Nigel/' + destinationFolder + '\\" '
  var destinationFilename = req.query.destinationFileName
  destinationFilename = ' \\"' + destinationFilename + '\\" '
  const fullSourcePath = sourceFilepath + '\\' + sourceFilename

  const graphqlFileInfo = '{"query":"mutation ($contvar:String) {createDocument(repositoryIdentifier:\\"OS1\\" fileInFolderIdentifier: ' +
  destinationFolder +
  'documentProperties: {name: ' +
    destinationFilename +
    'contentElements:{replace: [{type: CONTENT_TRANSFER contentType: \\"application/vnd.openxmlformats-officedocument.wordprocessingml.document\\" subContentTransfer: {content:$contvar} }]} } checkinAction: {} ) { id name } }", "variables":{"contvar":null} }'

  // console.log('graphqlFileInfo: ' + graphqlFileInfo)

  /*
 {"query":"mutation ($contvar:String) {createDocument(repositoryIdentifier:\\"OS1\\" fileInFolderIdentifier: \\"/TECHSALES HOME DIRECTORY/Nigel\\" documentProperties: {name: \\"RPA Cheat Sheetl\\" contentElements:{replace: [{type: CONTENT_TRANSFER contentType: \\"application/vnd.openxmlformats-officedocument.wordprocessingml.document\\" subContentTransfer: {content:$contvar} }]} } checkinAction: {} ) { id name } }", "variables":{"contvar":null} }',

 {"query":"mutation ($contvar:String) {createDocument(repositoryIdentifier:\"OS1\" fileInFolderIdentifier:  \"/TECHSALES HOME DIRECTORY/Nigel/medicalAssessment\" documentProperties: {name:  \"PatientAppointments\" contentElements:{replace: [{type: CONTENT_TRANSFER contentType: \"application/vnd.openxmlformats-officedocument.wordprocessingml.document\" subContentTransfer: {content:$contvar} }]} } checkinAction: {} ) { id name } }", "variables":{"contvar":null} }
*/
  // API calls
  var options = {
    method: 'POST',
    url: 'https://demo-emea-01.automationcloud.ibm.com/dba/dev/content-services-graphql/graphql',
    headers: {
      Authorization: 'Basic Z3JhcGhxbF9uaWdlbC5maWRAdDc5MjA6WEQ3WVFPVVg2d0ZtcDR2SHRraTR6ZjBBTE1GeFJaSXFmbVVDZEZsYg==',
      Cookie: 'PD-ID-FCN-dba=PD-ID=z8sxT/Ag8WUQFPYdjjrgQI8TxjG/Yd7Jze/vt+X0mcBWZ1qyyygUWsWbeMCgPCjhSrpO2XU7FzVUoeoNjFtmHi20DigiO+xL/BEotAXAlgNzH6KgCwD20pxOLOjAaAs635JSc6eSLyiuswRAetH3Mlpmu54AJ96EDpiXW0sgWVc64wet7fwY3FHFjHBxTQYuVhqTAygcgeNhknRjM2nu5Fs1WnJ4D6VExrKJdDWnyhjCbGGmf4Ft6hd3J+k5vt0TrespHd3KVO9X4M+3H9n29Qg1G50P94Xsab7Morrlg4GiVJfDuJZhyJRPxp3LxxRZ; PD-S-SESSION-ID=hYFcfR1dDb3hhaR35844PQ==:1_2_1_5RwTuKocFR5zbLcZWMYAsbNroVbd8o0OlYAjyrIKIzvq6woe|; com.ibm.bpm.saas.user=graphql_nigel.fid@t7920'
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
      res.send(errorResponse)
    } else {
      const returnResponse = { response: '00: File Uploaded' }
      console.log(returnResponse)
      res.send(returnResponse)
    }
  })
})

/**
*  This API can be used to invoke the RPA API
* @callback POST_/RPA_API
* @return 201 on success
* @return 400 if header invalid,resource not found,field unexpected or consent mismatch
* @return 500 otherwise of unexpected errors
*/
app.post('/runsync', function (req, res) {
  console.log('POST RPA API')

  // const apiKey = req.headers.api_key
  const rpaAgentUrl = req.query.rpaAgentUrl
  const script = req.query.script
  const unlockMachine = req.query.unlockMachine

  if (rpaAgentUrl === undefined) {
    const errorResponse = constructResponse(-1, 'FAIL', 'Missing rpaAgentUrl parameter.  For loopback set rpaAgentUrl to LOOPBACK')
    console.log(`Response: ${errorResponse}`)
    res.status(400).send(errorResponse)
    return
  }

  if (rpaAgentUrl.toUpperCase() === 'LOOPBACK') {
    const response = constructResponse(0, 'SUCCESS', 'OK')
    console.log(`Response: ${response}`)
    res.status(200).send(response)
    return
  }

  if (script === undefined) {
    const errorResponse = constructResponse(-1, 'FAIL', 'Missing Script parameter')
    console.log(`Response: ${errorResponse}`)
    res.status(400).send(errorResponse)
    return
  }

  if (unlockMachine === undefined) {
    const errorResponse = constructResponse(-1, 'FAIL', 'Missing UnlockMachine parameter.  Should be True or False')
    console.log(`Response: ${errorResponse}`)
    res.status(400).send(errorResponse)
    return
  }

  console.log('[Main] Authorized ok')

  var rpaUrl = rpaAgentUrl + '/scripts/' + script + '?unlockMachine=' + unlockMachine

  console.log('Calling URL:' + rpaUrl)

  // Move api key from header to body
  // req.body.api_key = apiKey

  // const body = { in_param_patient_id: nhsId }

  console.log('Body:' + JSON.stringify(req.body))

  axiosNoSSLCheckInstance
    .post(rpaUrl, req.body)
    .then(postRes => {
      console.log(`Response: ${postRes.status}`)
      console.log('Response data: ' + JSON.stringify(postRes.data))
      res.status(200).send(postRes.data)
    })
    .catch(error => {
      console.error(error)

      const response = constructResponse(-1, 'FAIL', error)
      console.log('Response: ' + JSON.stringify(response))
      res.status(404).send(response)
    })
})

/**
*  This API can be used to invoke ODM health assessment rules
* @callback POST /HealthAssessment_RuleApp/1.0/HealthAssessment/1.0
* @return 201 on success
* @return 400 if header invalid,resource not found,field unexpected or consent mismatch
* @return 500 otherwise of unexpected errors
*/
app.post('/HealthAssessment_RuleApp/1.0/HealthAssessment/1.0', function (req, res) {
  console.log('POST ODM health assessment')

  console.log('[Main] Authorized ok')

  const odmUrl = 'http://localhost:9090/DecisionService/rest/HealthAssessment_RuleApp/1.0/HealthAssessment/1.0'

  console.log('Calling URL:' + odmUrl)

  console.log('Body:' + JSON.stringify(req.body))

  axiosNoSSLCheckInstance
    .post(odmUrl, req.body)
    .then(postRes => {
      console.log(`Response: ${postRes.status}`)
      console.log(`Response: ${postRes.data}`)
      res.status(200).send(postRes.data)
    })
    .catch(error => {
      console.error(error)

      const response = constructResponse(-1, 'FAIL', error)
      console.log(`Response: ${response}`)
      res.status(404).send(response)
    })
})

if (process.env.NODE_ENV === 'production') {
  // Serve any static files

  // For dev
  // app.use(express.static(path.join(__dirname, 'client/build')));

  // For prod
  app.use(express.static(`${__dirname}/ui-react/build`))

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'ui-react/build', 'index.html'))
  })
}

app.listen(port, () => console.log(`Listening on port ${port}`))
