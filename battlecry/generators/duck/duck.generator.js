import { Generator, File, namedCasex, casex, log } from 'battlecry';

const CONFIG_FILE = 'configureStore.js';
const REDUX_PATH = 'src/redux';

export default class DuckGenerator extends Generator {
  config = { 
    init: {
      description: 'Create configStore.js file and an example duck'
    },
    generate: {
      args: 'name ...actions?',
      description: 'Create or modify duck to add actions'
    }
  };

  get configFile() {
    const template = this.template(CONFIG_FILE);
    const path = `${REDUX_PATH}/${template.filename}`;

    return new File(path);
  }

  get actions() {
    return (this.args.actions || ['set']).reverse();
  }

  init() {
    const configFile = this.configFile;
    if(configFile.exists) return log.warn(`Modular ducks have already been initiated. Please check the ${configFile.path} file`);

    this.template(CONFIG_FILE).saveAs(configFile.path);
    this.generator('duck').setArgs({name: 'todo'}).play('generate');
  }

  generate() {
    this.addActionsToDuck();
    this.addDuckToConfig();
  }

  addActionsToDuck() {
    const template = this.template('_*');
    const path = `${REDUX_PATH}/modules/${template.filename}`;

    let file = new File(path, this.args.name);
    if(!file.exists) file = template;
    
    this.actions.forEach(action => {
      file.after('// Actions', `const __NA_ME__ = '${casex(this.args.name, 'na-me')}/__NA-ME__';`, action);
      
      file.after('switch (action.type) {', [
        '    case __NA_ME__:',
        '      // Perform action',
        '      return state;'
      ], action);
      
      file.after('// Action Creators', [
        namedCasex('export function __naMe__() {', + `${action}_${this.args.name}`),
        '  return { type: __NA_ME__ };',
        '}',
        ''
      ], action);
    });

    file.saveAs(path, this.args.name);
  }

  addDuckToConfig() {
    const file = this.configFile;
    if(!file.exists) return null;

    file
      .afterLast('import ', "import __naMe__ from './modules/__naMe__'", this.args.name)
      .after('combineReducers({', '  __naMe__,', this.args.name)
      .save();
  }
}
