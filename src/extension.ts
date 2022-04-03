
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	
    let prefix= '';
    let setPrefix = vscode.commands.registerCommand('url-api-formatter.setPrefix', () => {
        vscode.window.showInputBox().then(val => {
            prefix = val || '';
        });
	});
    let model = `const ##METHOD##KEY##typeAssert = '##url'`;
    let setModel = vscode.commands.registerCommand('url-api-formatter.setModel', () => {
        vscode.window.showInputBox({
            value: model,
            placeHolder: `请输入字符串格式化模板： ##url, ##method(##METHOD), ##key(##KEY), ##typeAssert`
        }).then(val => {
            const _key = val?.match('##key') || val?.match("##KEY");
            const _url = val?.match('##url');
            const _method = val?.match('##method') || val?.match("##METHOD");
            if(_key && _url && _method) {
                model = val || model;
                vscode.window.showInformationMessage("模板修改成功");
            } else {
                vscode.window.showErrorMessage('输入模板字符串不规范');
            }
        });
	});
	let disposable = vscode.commands.registerCommand('url-api-formatter.formartUrl', () => {
        const anchor = vscode.window.activeTextEditor?.selection.anchor;
        const startLine = (anchor || {line: -1}).line;
        if(startLine === -1) {
            return;
        }
        const firstChar = vscode.window.activeTextEditor?.document.lineAt(startLine).firstNonWhitespaceCharacterIndex;
        const lastChar = vscode.window.activeTextEditor?.document.lineAt(startLine).text.length;
        const range = new vscode.Range(
            new vscode.Position(startLine || 0, firstChar || 0), 
            new vscode.Position(startLine || 0, lastChar || 0)
        );
        const originText = vscode.window.activeTextEditor?.document.getText(range) || '';
        const method = (originText.match?.(/@[a-z]+/) || [])[0];
        const unprefixedUrl = originText.replace(method, '');
        const METHOD = (method || '').slice(1);
        const URL = unprefixedUrl.replace(prefix, '').replace(/\{[a-z]+\}/, '');
        vscode.window.activeTextEditor?.edit(editBuilder => {
            let typeAssert = '';
            if(vscode.window.activeTextEditor?.document.languageId === 'typescript'){
                typeAssert = ': string';
            }
            let KEY = `${URL.replace(/\/([a-z-]+)/g, '_$1')}`.slice(1);
            let result = model
                .replace(/\#\#method\#\#key/g, `${METHOD ? METHOD+'_': ''}${KEY}`)
                .replace(/\#\#method\#\#KEY/g, `${METHOD ? METHOD+'_': ''}${KEY.toUpperCase()}`)
                .replace(/\#\#METHOD\#\#key/g, `${METHOD ? METHOD.toUpperCase()+'_': ''}${KEY}`)
                .replace(/\#\#METHOD\#\#KEY/g, `${METHOD ? METHOD.toUpperCase()+'_': ''}${KEY.toUpperCase()}`)
                .replace(/\#\#key/g, KEY)
                .replace(/\#\#KEY/g, KEY.toUpperCase())
                .replace(/\#\#method/g, METHOD)
                .replace(/\#\#METHOD/g, METHOD.toUpperCase())
                .replace(/\#\#url/g, URL)
                .replace(/\#\#typeAssert/g, typeAssert)
                .replace(/\\n/g, '\n');
            editBuilder.replace(range, result);
        });
	});
    context.subscriptions.push(setPrefix);
    context.subscriptions.push(setModel);
	context.subscriptions.push(disposable);
}

export function deactivate() {}
