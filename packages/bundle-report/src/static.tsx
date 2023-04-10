/*
Copyright 2022 ByteDance and/or its affiliates.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import '@abraham/reflection'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  RightOutlined,
  TagOutlined,
  DownOutlined,
  SwapOutlined,
} from '@ant-design/icons'
import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { loadTheme, registerIcons } from '@fluentui/react'
import { createTheme } from '@fluentui/theme'
import { MDXProvider } from '@mdx-js/react'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
// import * as ReactDOM from 'react-dom'
import { Switch, Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'

import { MDXComponents } from '@perfsee/components'
import { ThemeProvider } from '@perfsee/dls'
import { diffBundleResult } from '@perfsee/shared'

import { BundleReport, BundleContent } from '.'

// import ReportJson from '../../../.ht_bundle_analyzer/report.json'
// import ReportJson2 from '../../../.ht_bundle_analyzer/report2.json'

// import ModuleTreeJson from '../../../.ht_bundle_analyzer/moduleTree-report.json'

// window.artifact = { ...ReportJson, baseline: { ...ReportJson2, jobId: ReportJson2.id, score: ReportJson2.score! } }
// // window.artifact = ReportJson
// window.bundleReport = ReportJson
// window.bundleContent = ModuleTreeJson
// window.baseline = ReportJson2

dayjs.extend(relativeTime)
dayjs.extend(calendar)
dayjs.extend(duration)

const prefix = `${window.prefix}/bundle`
registerIcons({
  icons: {
    ChevronRightMed: <RightOutlined />,
    Tag: <TagOutlined />,
    sortdown: <ArrowDownOutlined />,
    sortup: <ArrowUpOutlined />,
    chevrondown: <DownOutlined />,
    swap: <SwapOutlined />,
  },
})

const ReportContainer = styled('div')({
  width: 1200,
  margin: '0 auto',
})

const ContentContainer = styled('div')({
  margin: '0 48px',
})

function BundleReportContainer() {
  const bundleDiff = diffBundleResult(window.bundleReport, window.baseline)
  const contentLink = `${prefix}/${window.artifact.id}/content`
  return (
    <ReportContainer>
      <BundleReport artifact={window.artifact} diff={bundleDiff} contentLink={contentLink} />
    </ReportContainer>
    // <ReportContainer>
    //   <BundleReport artifact={window.artifact} diff={bundleDiff} />
    // </ReportContainer>
  )
}

function BundleContentContainer() {
  return (
    <ContentContainer>
      <BundleContent content={window.bundleContent} />
    </ContentContainer>
  )
}

function App() {
  const theme = useTheme()

  useEffect(() => {
    loadTheme(
      createTheme({
        defaultFontStyle: {
          fontFamily: theme.text.fontFamily,
        },
      }),
    )
  }, [theme])
  const reportPath = `${prefix}/:id`
  const contentPath = `${prefix}/:id/content`
  return (
    <MDXProvider components={MDXComponents}>
      <BrowserRouter>
        <Switch>
          <Route path={reportPath} exact={true} component={BundleReportContainer} />
          <Route path={contentPath} exact={true} component={BundleContentContainer} />
        </Switch>
      </BrowserRouter>
    </MDXProvider>
  )
}

createRoot(document.getElementById('app')!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
)
