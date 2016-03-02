---
title: Unified Web Analytics
notes: 'Data powering [analytics.phila.gov](analytics.phila.gov): a public, near-real-time dashboard representing traffic to the City of Philadelphia’s web properties. '
maintainer: Lauren Ancona
maintainer_email: lauren.ancona@phila.gov
resources:
  - url: 'https://s3.amazonaws.com/analytics.phila.gov/data/realtime.json'
    name: active-users
    format: JSON
    description: 'Current count of users on the site, via Google Analytics Realtime API. Updated once per minute.'
  - url: 'https://s3.amazonaws.com/analytics.phila.gov/data/today.json'
    name: hourly-today
    format: JSON
    description: 'Daily traffic for current day, broken down by hour, via Google Analytics Core Reporting API. Updated hourly.'
  - url: 'https://s3.amazonaws.com/analytics.phila.gov/data/devices.json'
    name: devices
    format: JSON
    description: 'Traffic from past 90 days, broken down by device, via Google Analytics Core Reporting API. Updated daily.'
  - url: 'https://s3.amazonaws.com/analytics.phila.gov/data/os.json'
    name: operating-system
    format: JSON
    description: 'Visits over past 90 days, broken down by operating system, via Google Analytics Core Reporting API. Updated daily.'
  - url: 'https://s3.amazonaws.com/analytics.phila.gov/data/windows.json'
    name: windows-version
    format: JSON
    description: "Visits over past 90 days, broken down by windows version, via Google Analytics Core Reporting API. Updated daily.\r\n"
  - url: 'https://s3.amazonaws.com/analytics.phila.gov/data/browsers.json'
    name: browser
    format: JSON
    description: "Visits over past 90 days, broken down by browser, via Google Analytics Core Reporting API. Updated daily.\r\n"
  - url: 'https://s3.amazonaws.com/analytics.phila.gov/data/ie.json'
    name: internet-explorer
    format: JSON
    description: "Visits over past 90 days, broken down by internet explorer version, via Google Analytics Core Reporting API. Updated daily.\r\n"
  - url: 'https://s3.amazonaws.com/analytics.phila.gov/data/top-pages-realtime.json'
    name: top-20-pages-realtime
    format: JSON
    description: 'Top 20 pages by users, via Google Analytics Realtime API. Updated every minute.'
  - url: 'https://s3.amazonaws.com/analytics.phila.gov/data/top-domains-7-days.json'
    name: top-20-7-days
    format: JSON
    description: 'Top 20 pages by users over past 7 days, via Google Analytics Core Reporting API. Updated daily.'
  - url: 'https://s3.amazonaws.com/analytics.phila.gov/data/top-domains-30-days.json'
    name: top-20-30-days
    format: JSON
    description: "Top 20 pages by users over past 30 days, via Google Analytics Core Reporting API. Updated daily.\r\n"
---
