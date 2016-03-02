---
title: Snow Emergency Routes
notes: "From the Streets Department snow emergency route page\r\n\r\nWhen snow accumulations approach emergency status, the Managing Director may declare a snow emergency. Once emergency status is declared, the City's 110 miles of Snow Emergency Routes receive priority. Owners of vehicles and dumpsters must move them to alternate parking spaces so City forces can clear snow from curb-to-curb on the emergency routes. Any vehicle remaining on a Snow Emergency Route during the declared Snow Emergency will be ticketed and towed. If your car is towed, call 215-686-SNOW for its location. Do NOT call 911.\r\nThe snow-emergency-routes.csv file was created from the table on the Streets Department snow emergency route page. I used this file to generate the snow-emergency-route-segment-ids.csv file.\r\n\r\nThe snow-emergency-route-segment-ids.csv file contains the IDs of all of the street segments that are classified as snow emergency routes. The snow emergency routes shapefile/geojson is built by filtering the street centerline layer to include only those rows where the seg_id is contained in this list."
maintainer: ''
maintainer_email: ''
organization: Streets Department
resources:
  - url: 'http://dev.socrata.com/foundry/#/data.phila.gov/xgeq-dez5'
    name: Snow Emergency Routes API Docs
    format: HTML
    description: ''
  - url: 'https://data.phila.gov/resource/xgeq-dez5.json'
    name: Snow Emergency Routes API
    format: api
    description: ''
  - url: 'https://data.phila.gov/api/views/xgeq-dez5/rows.csv?accessType=DOWNLOAD'
    name: Snow Emergency Routes CSV
    format: CSV
    description: ''
  - url: 'https://raw.githubusercontent.com/CityOfPhiladelphia/phl-snow-emergency-routes/master/snow-emergency-route-segment-ids.csv'
    name: Snow Emergency Routes Segment IDs CSV
    format: CSV
    description: ''
---
