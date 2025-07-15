const getContentfulRelatedProjects = () => {
  const promise = contentfulClient.getEntries({
    content_type: 'relatedProjects'
  });
  
  return promise.then((results) => {
    const projects = results.items.map(({ fields, sys: { id } }) => {
      return {
        id: id,
        label: fields.label,
        url: fields.url
      }
    });

    return projects;
  });
}