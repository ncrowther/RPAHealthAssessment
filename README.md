# RPA Health Assessment
# CP4A Demo with RPA, ODM and Content Navigator

Folders:

- ApiFacade - nodejs API that act as a facade over ODM, RPA and Content Navigator
     - systmone - Fictional web site that simulates patient health records
     - OpenAPI - OpenAPI Specificaton for facade APIs
- baw - TWX file containing orchestration flow for health assessment
- Bot - Contains a Bot to extract data from patient health website, and  a bot to build a health report. Both bots are invoked from BAW
