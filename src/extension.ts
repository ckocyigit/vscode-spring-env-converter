import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let envToPropDisposable = vscode.commands.registerCommand('envToProp', () => {
    manipulateSelection((text: string) => {
      return envToProp(text);
    });
  });

  let propToEnvDisposable = vscode.commands.registerCommand('propToEnv', () => {
    manipulateSelection((text: string) => {
      return propToEnv(text);
    });
  });

  context.subscriptions.push(envToPropDisposable);
  context.subscriptions.push(propToEnvDisposable);
}

function manipulateSelection(manipulationFunction: (text: string) => string) {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const selection = editor.selection;
    const text = editor.document.getText(selection);
    const manipulatedText = manipulationFunction(text);

    editor.edit((editBuilder) => {
      editBuilder.replace(selection, manipulatedText);
    });
  }
}

function propToEnv(text: string): string {
  const regex = /[a-zA-Z0-9.-]+(?==)/g;
  let matches = text.match(regex) ?? [];

  for (const match of matches) {
    let replacement = match.toUpperCase().replace(/\./g, "_").replace(/\-/g, "");
    text = text.replace(match, replacement);
  }
  return text
}

function envToProp(text: string): string {
  const regexMatcher = /[A-Z0-9_]+(?=\=)/g;
  let matches = text.match(regexMatcher) ?? [];

  for (const match of matches) {
    let replacement = match.toLowerCase().replace(/_/g, ".");
    text = text.replace(match, replacement);
  }
  return text
}