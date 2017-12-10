import React, {Component}  from 'react'
import { dialog } from 'electron';
import styles from '../styles/local.css'
import XLSX from 'xlsx'
import fs from 'fs'
import Inspector from 'react-inspector'
var ipc = require('electron').ipcRenderer;

export default class ItemPurchase extends Component {
    constructor() {
        super();
        this.state = {
            data: null
        }
        this.loadFile = this.loadFile.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {        
        // ipc.on('data', (event, data) => {
        //     // console.log(data);
        //     that.setState({data});
        // })

        ipc.on('response', (event, arg) => {
            console.log(arg);
        })

        ipc.on('error', (event, arg) => {
            console.log(arg);
        })
    }

    loadFile() {
        // PROD
        var dialog = require('electron').remote.dialog;
        
        var o = dialog.showOpenDialog({ properties: ['openFile'] });
        console.log(o);
        var wb = XLSX.readFile(o[0]);

        var data = [];

        wb.SheetNames.forEach(function(sheetName) {
			data.push(
                XLSX.utils.sheet_to_json(
                    wb.Sheets[sheetName],
                    {range: 1}
                )
            )
        });
        
        console.log(wb.Props.Title);

        this.setState({data});

        // DEV
        // var wb = XLSX.readFile("/Users/jon/dev/select/inventory/node/select-inventory/data/Order_Template.xlsx");
        
        // var sheetList = [];

        // wb.SheetNames.forEach(function(sheetName) {
        //     sheetList.push(
        //         XLSX.utils.sheet_to_json(
        //             wb.Sheets[sheetName],
        //             {range: 1}
        //         )
        //     )
        // });
        // 
        // this.setState({
        //     data: sheetList,
        //     sheets: {
        //         frozen: sheetList[0],
        //         refrigerated: sheetList[1],
        //         dry: sheetList[2],
        //         paper: sheetList[3]
        //     }
        // });
    }

    handleSubmit(){ 
        ipc.send('post', {
            type: 'itemPurchase',
            data: this.state.data
        });
        
        // fetch('http://localhost:8080/api/items', {
        //     method: 'post',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify(this.state.sheets)
        // }).then(response => console.log);
    };


    render() {
        if (this.state.data) {
            return(
                <div id="template">
                    <h3>Template Uploader</h3>

                    <Inspector data={this.state.data} />

                    <button onClick={() => this.handleSubmit()}>
                        Add to Database
                    </button>
                </div>
            )
        }
        return(
            <div id="template">
                <h3>Template Uploader</h3>
                
                <button onClick={() => this.loadFile()}>
                    Load Data
                </button>     
            </div>
        );
    }
}

