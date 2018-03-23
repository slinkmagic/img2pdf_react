function upload() {
  tryAxios()
}

tryAxios() {
  return axios.post(putS3, { filename: file.name, filetype: 'multipart/form-data' })
  .then((results) => {
    console.log("++ post : " + results.data);
    console.log(results.data.url);

    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Requested-With': 'XMLHttpRequest',
      }
    };
    console.log("++ put : start");
    console.log(file);
    return axios.put(results.data, file, options)
      .then((results) => {
        console.log(results);
        console.log("++ put : end");
        return this.createResultObject('【成功】', file, 'dumyURL');
      }).catch((error) => {
        console.log(error);
      });
  });
}