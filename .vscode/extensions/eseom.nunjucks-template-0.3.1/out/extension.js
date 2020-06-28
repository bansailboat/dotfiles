"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prettydiff = require("prettydiff2");
const vscode = require("vscode");
const prettyDiff = (document, range, options) => {
    const content = document.getText(range);
    const workspaceConfig = vscode.workspace.getConfiguration("editor");
    const activeEditorOptions = vscode.window.activeTextEditor.options;
    const insize = activeEditorOptions.tabSize || workspaceConfig.tabSize;
    const inchar = activeEditorOptions.insertSpaces ? " " : "\t";
    const newText = prettydiff({
        source: content,
        lang: "twig",
        mode: "beautify",
        insize,
        inchar,
        // newline: vscodeConfig.newLine,
        // objsort: vscodeConfig.methodChain,
        // wrap: vscodeConfig.wrap,
        // methodchain: vscodeConfig.methodchain,
        // ternaryline: vscodeConfig.ternaryLine,
        jekyll: true,
    });
    return [vscode.TextEdit.replace(range, newText)];
};
function activate(context) {
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider("njk", {
        provideDocumentFormattingEdits(document, options, token) {
            // entire contents
            const start = new vscode.Position(0, 0);
            const end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            const rng = new vscode.Range(start, end);
            return prettyDiff(document, rng, options);
        },
    }));
    const EMPTY_ELEMENTS = [
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "keygen",
        "link",
        "menuitem",
        "meta",
        "param",
        "source",
        "track",
        "wbr",
    ];
    vscode.languages.setLanguageConfiguration("njk", {
        onEnterRules: [
            {
                beforeText: new RegExp(`<(?!(?:${EMPTY_ELEMENTS.join("|")}))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$`, "i"),
                afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>/i,
                action: { indentAction: vscode.IndentAction.IndentOutdent },
            },
            {
                beforeText: new RegExp(`<(?!(?:${EMPTY_ELEMENTS.join("|")}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`, "i"),
                action: { indentAction: vscode.IndentAction.Indent },
            },
        ],
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map