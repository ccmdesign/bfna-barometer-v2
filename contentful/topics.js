const getMarker = (fields, infographicsList) => {

  const labelMarkers = ['customMarkerLabel1', 'customMarkerLabel2', 'customMarkerLabel3']
  const dateMarkers = ['customMarkerDate1', 'customMarkerDate2', 'customMarkerDate3']

  for (let item of labelMarkers) {
    if(fields) {
      if(item in fields && (item && dateMarkers[labelMarkers.indexOf(item)])) {
        infographicsList.push({
          key: fields[item].split(" ").join(""),
          isMarker: true,
          label: fields[item],
          val: fields[dateMarkers[labelMarkers.indexOf(item)]],
        })
      }    
    }
  }
}

const setDateInterval = (date, day) => {
  let newDate = new Date(Number(date))
  newDate.setDate(date.getDate() + day)

  return newDate
}

const getExtra = (extras) => {
  let result = {}
  for(let i of extras) {
    let country = i.substr(0, i.indexOf("|")).trim();
    let text = i.substr(i.indexOf('|') +1, i.length).trim();

    result[country.toLowerCase()] = text
  }

  return result
}

const getContentfulTopics = () => {
  const promise = contentfulClient.getEntries({
    content_type: "topics",
    order: '-fields.period'
    // include: 2,
  });

  return promise.then(async (results) => {
    const topics = {}
    const countries = await getContentfulCountries()
    const tremapChartList = await getContentfulTreemap();

    results.items.forEach(async ({ fields, sys: { id } }) => {
      if(topicsFromStatements.includes(id)) {
        
        topics[id] = {
          id: id,
          topic: fields.topic,
          isArchived: fields.archived && fields.archived == true ? true : false,
          slug: slugify(fields.topic),
          description: fields.description,
          period: fields.period ? `${new Date(fields.period).toLocaleDateString('en', { timeZone:'utc' ,month: 'long' })} ${new Date(fields.period).getFullYear()}` : '',
          periodWithDay: fields.period,
          tags: fields.tags, // 'tags': ['development', 'geoeconomics'],
          infographic: fields.infographic ? fields.infographic : '',
          video: fields.video ? fields.video : '',
          deepDive: fields.deepDive ? fields.deepDive : '',

          // new infographic info
          infographicsType2: fields.infographics,
          infographics: fields.infographics ? fields.infographics.map((item) => {
            let infographicObject = {}
            if(item.sys.contentType.sys.id == 'rankingChart') {
              infographicObject = { 
                title: item.fields.title,
              }
              item.fields.ranking.forEach((country, index) => {
                const countryName = countries.find((c) => c.id === country.sys.id);
                const formattedCountryName = formatCountryName(countryName.name);
                infographicObject[formattedCountryName] = index;
              });
              item.fields = infographicObject
            } else if(item.sys.contentType.sys.id == 'treemapChart') {
              item.fields = tremapChartList.find((c) => c.id === item.sys.id);
            }

            let infographicsList = []
            let vizCountriesObj = {}
            let vizMarkersObj = {}
            let timelineExtra = item.fields && item.fields.extra ? getExtra(item.fields.extra) : {}
            for(let obj in item.fields) {
              if(obj in getCodeByCountryCamelCase) {
                infographicsList.push({
                  country: getCodeByCountryCamelCase[obj],
                  val: item.fields[obj],
                  extra: timelineExtra[getCodeByCountryCamelCase[obj]]
                })
                vizCountriesObj[getCodeByCountryCamelCase[obj]] = true
              }

            }
            getMarker(item.fields, infographicsList)
            for (let item of infographicsList) {
              if(item.isMarker) {
                let key = item.label.split(" ").join("")
                vizMarkersObj[key] = {
                  label: item.label,
                  val: true,
                }
              }
            }

            return {
              infographicId: item.sys.id,
              infographicType: item.sys.contentType ? item.sys.contentType.sys.id : '',
              title: item.fields ? item.fields.title : '',
              scaleLimit: item.fields ? item.fields.scaleLimit : null,
              slug: item.fields ? slugify(item.fields.title) : '',
              infographicDescription: item.fields && item.fields.description ? item.fields.description : item.fileds ? item.fields.title : '',
              infographicAxisLabel: item.fields ? item.fields.axisLabel : '',
              infographicValuesAsPercentage: item.fields ? item.fields.valuesAsPercentage : '',
              orientation: item.fields ? item.fields.orientation : '',
              cells: item.fields ? item.fields.cells : [],
              countries: infographicsList.sort((a, b) => {
                if(item.sys.contentType.sys.id === 'timelineChart') {
                  let dateA = new Date(a.val);
                  let dateB = new Date(b.val);    
                  return dateA - dateB 
                } else if (item.sys.contentType.sys.id === 'rankingChart') {
                  return a.val - b.val
                } else {
                  if(!item.fields.orientation) {
                    return b.val - a.val
                  } else {
                    return a.val - b.val
                  }
                }
              }),
              vizCountries: vizCountriesObj,
              vizMarkers: vizMarkersObj,
              customInfographicFile: {
                url: item.fields && item.fields.file && item.fields.file ? item.fields.file.fields.file.url : '',
                title: item.fields && item.fields.file && item.fields.file.fields ? item.fields.file.fields.title : ''
              }
            }
          }) : []
        };
      }
    });
    if(topics){
      let mostRecentlty = Object.values(topics)[0];
      for (let id in topics){
        // BAR-199 ordenar pelo mais recente considerando o período.
        // a flag aparece dentro do período de 30 dias a partir da data inicial.
        let topic = topics[id]
        let initialDate = new Date(topic.periodWithDay)
        let interval = setDateInterval(initialDate, 30)
        
        topic.id === mostRecentlty.id || new Date() <= interval ? topic.new = true : topic.new = false;
      }
    }

    return topics;
  });
};