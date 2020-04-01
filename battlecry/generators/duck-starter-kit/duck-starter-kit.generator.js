import { Generator, File, casex, log } from 'battlecry';

const CONFIG_FILE = 'configureStore.js';
const REDUCERS_FILE = 'reducers.js';
const REDUX_PATH = 'src/redux';

export default class DuckStarterKitGenerator extends Generator {
  config = {
    init: {
      description: 'Create configStore.js and reducers.js files using redux-starter-kit and an example duck'
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

  get reducersFile() {
    const template = this.template(REDUCERS_FILE);
    const path = `${REDUX_PATH}/${template.filename}`;

    return new File(path);
  }

  get actions() {
    return (this.args.actions || ['set']).reverse();
  }

  init() {
    const configFile = this.configFile;

    if(configFile.exists) {
      log.warn(`${CONFIG_FILE} has already been initiated. Please check the ${configFile.path} file`);
    } else {
      this.template(CONFIG_FILE).saveAs(configFile.path);
    }

    const reducersFile = this.reducersFile;

    if(reducersFile.exists) {
      log.warn(`${REDUCERS_FILE} has already been initiated. Please check the ${reducersFile.path} file`);
    } else {
      this.template(REDUCERS_FILE).saveAs(reducersFile.path);
    }

    if (!configFile.exists && !reducersFile.exists) {
      this.generator('duck-starter-kit').setArgs({name: 'todo'}).play('generate');
    }
  }

  generate() {
    this.addActionsToDuck();
    this.addDuckToReducers();
  }

  addActionsToDuck() {
    const template = this.template('_*');
    const path = `${REDUX_PATH}/modules/${template.filename}`;

    let file = new File(path, this.args.name);
    if(!file.exists) file = template;

    this.actions.forEach(action => {
      file.after('// Action Creators', `export const __naMe__ = createAction('${casex(this.args.name, 'na-me')}/__NA-ME__');`, action);

      file.after('createReducer(initialState, {', [
        '  [__naMe__]: (state, action) => {',
        '    // Perform action',
        '  },'
      ], action);
    });

    file.saveAs(path, this.args.name);
  }

  addDuckToReducers() {
    const file = this.reducersFile;

    if(!file.exists) return null;

    try {
      const reducerExistsLine = file.search('  __naMe__,', this.args.name);
      log.warn(`Found existing reducer "${casex(this.args.name, 'naMe')}" in line ${reducerExistsLine} of ${file.dirname}/${file.filename}`);
    } catch (e) {
      file
        .after('// Reducers', "import __naMe__ from './modules/__naMe__'", this.args.name)
        .after('const reducers = {', '  __naMe__,', this.args.name)
        .save();
    }
  }
}
