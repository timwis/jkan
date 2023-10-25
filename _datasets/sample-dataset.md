---
schema: default
title: Sample dataset
organization: Sample Department
notes: This is an example dataset that comes with a new installation of JKAN
resources:
  - name: Air Monitoring Stations CSV
    url: 'http://data.phl.opendata.arcgis.com/datasets/1839b35258604422b0b520cbb668df0d_0.csv'
    format: csv
  - name: Air Monitoring Stations Shapefile
    url: 'http://data.phl.opendata.arcgis.com/datasets/1839b35258604422b0b520cbb668df0d_0.zip'
    format: shp
  - name: Air Monitoring Stations GeoService
    url: 'https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Air_Monitoring_Stations/FeatureServer/0/query'
    format: api
license: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/'
category:
  - 01-raw
maintainer: Tim Wisniewski
maintainer_email: tim@timwis.com
project:
  - My Kedro Project
preview: |
  <table border="1" class="dataframe">
    <thead>
      <tr style="text-align: right;">
        <th></th>
        <th>id</th>
        <th>company_rating</th>
        <th>company_location</th>
        <th>total_fleet_count</th>
        <th>iata_approved</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>0</th>
        <td>35029</td>
        <td>100%</td>
        <td>Niue</td>
        <td>4.0</td>
        <td>f</td>
      </tr>
      <tr>
        <th>1</th>
        <td>30292</td>
        <td>67%</td>
        <td>Anguilla</td>
        <td>6.0</td>
        <td>f</td>
      </tr>
      <tr>
        <th>2</th>
        <td>19032</td>
        <td>67%</td>
        <td>Russian Federation</td>
        <td>4.0</td>
        <td>f</td>
      </tr>
      <tr>
        <th>3</th>
        <td>8238</td>
        <td>91%</td>
        <td>Barbados</td>
        <td>15.0</td>
        <td>t</td>
      </tr>
      <tr>
        <th>4</th>
        <td>30342</td>
        <td>NaN</td>
        <td>Sao Tome and Principe</td>
        <td>2.0</td>
        <td>t</td>
      </tr>
      <tr>
        <th>5</th>
        <td>32413</td>
        <td>100%</td>
        <td>Faroe Islands</td>
        <td>1.0</td>
        <td>f</td>
      </tr>
      <tr>
        <th>6</th>
        <td>35620</td>
        <td>90%</td>
        <td>Micronesia</td>
        <td>3.0</td>
        <td>f</td>
      </tr>
      <tr>
        <th>7</th>
        <td>23820</td>
        <td>NaN</td>
        <td>Rwanda</td>
        <td>1.0</td>
        <td>t</td>
      </tr>
      <tr>
        <th>8</th>
        <td>46528</td>
        <td>100%</td>
        <td>Uzbekistan</td>
        <td>3.0</td>
        <td>t</td>
      </tr>
      <tr>
        <th>9</th>
        <td>11875</td>
        <td>100%</td>
        <td>Micronesia</td>
        <td>2.0</td>
        <td>t</td>
      </tr>
    </tbody>
  </table>
---
