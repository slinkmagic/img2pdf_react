import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import * as consts from '../../const';
import ResultTable from '../ResultTable';

const putS3 = "https://esc47o2zul.execute-api.ap-northeast-1.amazonaws.com/putS3/";

//Appクラス = Appコンポーネント(カスタムタグ)
class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUploading: false,
      items: []
    };
    this.handleOnDrop = this.handleOnDrop.bind(this);

    setInterval(() => {
      this.checkCompleteConvert();
    }, 3000); // 1秒毎にチェック
  }

  // 変換が完了すると404が200になるので監視する
  checkCompleteConvert() {
    this.state.items.forEach((item) => {
      if (item.message === consts.CONVERTING) {
        this.isConvert(item.url)
          .then((result) => {
            item.message = result;
            this.setState({ items: this.state.items });
          });
      }
    });
  }

  isConvert(url) {
    return axios.get(url)
      .then((result) => {
        return consts.SUCCESS;
      })
      .catch((error) => {
        return consts.CONVERTING;
      });
  }

  validation(file) {
    // fileが含まれない場合
    if (!file || !file.name || !file.type) return this.createResultObject(consts.FAILED_NOT_FOUND, null, '');

    // 拡張子がzipであることの確認
    if (!file.name.endsWith('.zip')) return this.createResultObject(consts.FAILED_UN_SUPPORTED, file, '');

    // サイズが100M以下であることの確認
    // TODO

    return null;
  }

  handleOnDrop(files) {
    this.setState({ isUploading: true });

    Promise.all(files.map(file => this.uploadImage(file)))
      .then(items => {
        this.setState({
          isUploading: false,
          items: this.state.items.concat(items)
        });
      }).catch(e => console.log(e));
  }

  uploadImage(file) {
    // バリデーションチェックに失敗した場合は結果を返却
    const validationResults = this.validation(file);
    if (validationResults) return validationResults;

    const options = {
      headers: {
        'Content-Type': 'application/json',
      }
    }

    return axios.post(putS3, { filename: file.name, filetype: file.type }, options)
      .then((urls) => {

        const options = {
          headers: {
            'Content-Type': file.type,
          }
        };
        return axios.put(urls.data.puturl, file, options)
          .then((results) => {
            return this.createResultObject(consts.CONVERTING, file, urls.data.geturl, false);
          }).catch((error) => {
            console.log(error);
          });
      });
  }

  createResultObject(message, file, url) {
    file = !file ? { name: '不明', type: '不明' } : file;
    return {
      message: message,
      file: file,
      url: url,
    }
  }

  render() {
    return (
      <div style={{ width: 960, margin: '20px auto' }}>
        <h1>zipをPDFに変換する奴</h1>
        <Dropzone onDrop={this.handleOnDrop}>
          <div>zipをドラックまたはクリック</div>
        </Dropzone>
        {this.state.isUploading ?
          <div>ファイルをアップロードしています</div> :
          <div>ここにzipをドラックまたはクリック</div>}
        {this.state.items.length > 0 &&
          <div style={{ margin: 30 }}>
              {/* this.state.items.map(({ message, file, url }) =>
                <a key={Math.random() * 100000} href={url}>{message} {file.name}</a>
              ) */}
              <ResultTable items={this.state.items} />
          </div>}
      </div>
    );
  }
}

//他の場所で読み込んで使えるようにexport
export default Upload;