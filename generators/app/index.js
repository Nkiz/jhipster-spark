/**
 * Copyright 2013-2018 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see http://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable consistent-return */
const chalk = require('chalk');
const _ = require('lodash');
const prompts = require('./prompts');
const BaseGenerator = require('../generator-base');
const writeFiles = require('./files').writeFiles;
const packagejs = require('../../package.json');
const crypto = require('crypto');
const os = require('os');
const constants = require('../generator-constants');
const utils = require('../utils');

let useBlueprint;

module.exports = class extends BaseGenerator {
    constructor(args, opts) {
        super(args, opts);
        
        this.configOptions = this.options.configOptions || {};
        utils.copyObjectProps(this, this.options.context);
        this.setupServerOptions(this);
        const blueprint = this.options.blueprint || this.configOptions.blueprint || this.config.get('blueprint');
        useBlueprint = this.composeBlueprint(blueprint, 'entity'); // use global variable since getters dont have access to instance property
    }

    get initializing() {
        if (useBlueprint) return;
        return {
            displayLogo() {
                if (this.logo) {
                    this.printJHipsterLogo();
                }
            },
            
            setupconsts() {
                const context = this.context;
            },

            setupServerconsts() {
                // Make constants available in templates
                this.MAIN_DIR = constants.MAIN_DIR;
                this.TEST_DIR = constants.TEST_DIR;
                this.CLIENT_MAIN_SRC_DIR = constants.CLIENT_MAIN_SRC_DIR;
                this.CLIENT_TEST_SRC_DIR = constants.CLIENT_TEST_SRC_DIR;
                this.SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
                this.SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;
                this.SERVER_TEST_SRC_DIR = constants.SERVER_TEST_SRC_DIR;
                this.SERVER_TEST_RES_DIR = constants.SERVER_TEST_RES_DIR;

                this.DOCKER_JHIPSTER_REGISTRY = constants.DOCKER_JHIPSTER_REGISTRY;
                this.DOCKER_JAVA_JRE = constants.DOCKER_JAVA_JRE;
                this.DOCKER_MYSQL = constants.DOCKER_MYSQL;
                this.DOCKER_MARIADB = constants.DOCKER_MARIADB;
                this.DOCKER_POSTGRESQL = constants.DOCKER_POSTGRESQL;
                this.DOCKER_MONGODB = constants.DOCKER_MONGODB;
                this.DOCKER_COUCHBASE = constants.DOCKER_COUCHBASE;
                this.DOCKER_MSSQL = constants.DOCKER_MSSQL;
                this.DOCKER_ORACLE = constants.DOCKER_ORACLE;
                this.DOCKER_HAZELCAST_MANAGEMENT_CENTER = constants.DOCKER_HAZELCAST_MANAGEMENT_CENTER;
                this.DOCKER_CASSANDRA = constants.DOCKER_CASSANDRA;
                this.DOCKER_ELASTICSEARCH = constants.DOCKER_ELASTICSEARCH;
                this.DOCKER_KEYCLOAK = constants.DOCKER_KEYCLOAK;
                this.DOCKER_KAFKA = constants.DOCKER_KAFKA;
                this.DOCKER_ZOOKEEPER = constants.DOCKER_ZOOKEEPER;
                this.DOCKER_SONAR = constants.DOCKER_SONAR;
                this.DOCKER_JHIPSTER_CONSOLE = constants.DOCKER_JHIPSTER_CONSOLE;
                this.DOCKER_JHIPSTER_ELASTICSEARCH = constants.DOCKER_JHIPSTER_ELASTICSEARCH;
                this.DOCKER_JHIPSTER_LOGSTASH = constants.DOCKER_JHIPSTER_LOGSTASH;
                this.DOCKER_TRAEFIK = constants.DOCKER_TRAEFIK;
                this.DOCKER_CONSUL = constants.DOCKER_CONSUL;
                this.DOCKER_CONSUL_CONFIG_LOADER = constants.DOCKER_CONSUL_CONFIG_LOADER;
                this.DOCKER_SWAGGER_EDITOR = constants.DOCKER_SWAGGER_EDITOR;

                this.JAVA_VERSION = constants.JAVA_VERSION;
                this.SCALA_VERSION = constants.SCALA_VERSION;

                this.NODE_VERSION = constants.NODE_VERSION;
                this.YARN_VERSION = constants.YARN_VERSION;
                this.NPM_VERSION = constants.NPM_VERSION;

                this.packagejs = packagejs;
                this.applicationType = this.config.get('applicationType') || this.configOptions.applicationType;
                if (!this.applicationType) {
                    this.applicationType = 'monolith';
                }

                this.packageName = this.config.get('packageName');
                this.serverPort = this.config.get('serverPort');
                if (this.serverPort === undefined) {
                    this.serverPort = '8080';
                }
                this.websocket = this.config.get('websocket') === 'no' ? false : this.config.get('websocket');
                this.searchEngine = this.config.get('searchEngine') === 'no' ? false : this.config.get('searchEngine');
                if (this.searchEngine === undefined) {
                    this.searchEngine = false;
                }
                this.jhiPrefix = this.configOptions.jhiPrefix || this.config.get('jhiPrefix');
                this.jhiTablePrefix = this.getTableName(this.jhiPrefix);
                this.messageBroker = this.config.get('messageBroker') === 'no' ? false : this.config.get('messageBroker');
                if (this.messageBroker === undefined) {
                    this.messageBroker = false;
                }

                this.enableSwaggerCodegen = this.config.get('enableSwaggerCodegen');

                this.serviceDiscoveryType = this.config.get('serviceDiscoveryType') === 'no' ? false : this.config.get('serviceDiscoveryType');
                if (this.serviceDiscoveryType === undefined) {
                    this.serviceDiscoveryType = false;
                }

                this.cacheProvider = this.config.get('cacheProvider') || this.config.get('hibernateCache') || 'no';
                this.enableHibernateCache = this.config.get('enableHibernateCache') || (this.config.get('hibernateCache') !== undefined && this.config.get('hibernateCache') !== 'no');

                this.databaseType = this.config.get('databaseType');
                if (this.databaseType === 'mongodb') {
                    this.devDatabaseType = 'mongodb';
                    this.prodDatabaseType = 'mongodb';
                    this.enableHibernateCache = false;
                } else if (this.databaseType === 'couchbase') {
                    this.devDatabaseType = 'couchbase';
                    this.prodDatabaseType = 'couchbase';
                    this.enableHibernateCache = false;
                } else if (this.databaseType === 'cassandra') {
                    this.devDatabaseType = 'cassandra';
                    this.prodDatabaseType = 'cassandra';
                    this.enableHibernateCache = false;
                } else if (this.databaseType === 'no') {
                    // no database, only available for microservice applications
                    this.devDatabaseType = 'no';
                    this.prodDatabaseType = 'no';
                    this.enableHibernateCache = false;
                } else {
                    // sql
                    this.devDatabaseType = this.config.get('devDatabaseType');
                    this.prodDatabaseType = this.config.get('prodDatabaseType');
                }

                // Hazelcast is mandatory for Gateways, as it is used for rate limiting
                if (this.applicationType === 'gateway') {
                    this.cacheProvider = 'hazelcast';
                }

                this.buildTool = this.config.get('buildTool');
                this.enableSocialSignIn = this.config.get('enableSocialSignIn');
                this.jhipsterVersion = packagejs.version;
                if (this.jhipsterVersion === undefined) {
                    this.jhipsterVersion = this.config.get('jhipsterVersion');
                }
                this.authenticationType = this.config.get('authenticationType');
                if (this.authenticationType === 'session') {
                    this.rememberMeKey = this.config.get('rememberMeKey');
                }
                this.jwtSecretKey = this.config.get('jwtSecretKey');
                this.nativeLanguage = this.config.get('nativeLanguage');
                this.languages = this.config.get('languages');
                this.uaaBaseName = this.config.get('uaaBaseName');
                this.clientFramework = this.config.get('clientFramework');
                const testFrameworks = this.config.get('testFrameworks');
                if (testFrameworks) {
                    this.testFrameworks = testFrameworks;
                }

                const baseName = this.config.get('baseName');
                if (baseName) {
                    // to avoid overriding name from configOptions
                    this.baseName = baseName;
                }

                // force variables unused by microservice applications
                if (this.applicationType === 'microservice' || this.applicationType === 'uaa') {
                    this.websocket = false;
                }

                const serverConfigFound = this.packageName !== undefined &&
                    this.authenticationType !== undefined &&
                    this.cacheProvider !== undefined &&
                    this.enableHibernateCache !== undefined &&
                    this.websocket !== undefined &&
                    this.databaseType !== undefined &&
                    this.devDatabaseType !== undefined &&
                    this.prodDatabaseType !== undefined &&
                    this.searchEngine !== undefined &&
                    this.buildTool !== undefined;

                if (this.baseName !== undefined && serverConfigFound) {
                    // Generate remember me key if key does not already exist in config
                    if (this.authenticationType === 'session' && this.rememberMeKey === undefined) {
                        this.rememberMeKey = crypto.randomBytes(20).toString('hex');
                    }

                    // Generate JWT secret key if key does not already exist in config
                    if (this.authenticationType === 'jwt' && this.jwtSecretKey === undefined) {
                        this.jwtSecretKey = crypto.randomBytes(20).toString('hex');
                    }
                    // user-management will be handled by UAA app, oauth expects users to be managed in IpP
                    if ((this.applicationType === 'gateway' && this.authenticationType === 'uaa') || this.authenticationType === 'oauth2') {
                        this.skipUserManagement = true;
                    }

                    this.log(chalk.green('This is an existing project, using the configuration from your .yo-rc.json file \n' +
                        'to re-generate the project...\n'));

                    this.existingProject = true;
                }
            }
        };
    }

    get prompting() {
        if (useBlueprint) return;
        return {
            askForModuleName: prompts.askForModuleName,
            askForServerSideOpts: prompts.askForServerSideOpts,
			askForFields: prompts.askForFields,
			
            /* askForOptionalItems: prompts.askForOptionalItems, */
            /* askFori18n: prompts.askFori18n, */

            setSharedConfigOptions() {
                this.configOptions.packageName = this.packageName;
                this.configOptions.cacheProvider = this.cacheProvider;
                this.configOptions.enableHibernateCache = this.enableHibernateCache;
                this.configOptions.websocket = this.websocket;
                this.configOptions.databaseType = this.databaseType;
                this.configOptions.devDatabaseType = this.devDatabaseType;
                this.configOptions.prodDatabaseType = this.prodDatabaseType;
                this.configOptions.searchEngine = this.searchEngine;
                this.configOptions.messageBroker = this.messageBroker;
                this.configOptions.serviceDiscoveryType = this.serviceDiscoveryType;
                this.configOptions.buildTool = this.buildTool;
                this.configOptions.enableSocialSignIn = this.enableSocialSignIn;
                this.configOptions.enableSwaggerCodegen = this.enableSwaggerCodegen;
                this.configOptions.authenticationType = this.authenticationType;
                this.configOptions.uaaBaseName = this.uaaBaseName;
                this.configOptions.serverPort = this.serverPort;
                
                this.configOptions.entity = "";
                this.configOptions.entities = [];
                this.configOptions.field = "";
                this.configOptions.fields = [];
                
                this.configOptions.context = this.options.context;

                // Make dist dir available in templates
                if (this.buildTool === 'maven') {
                    this.BUILD_DIR = 'target/';
                } else {
                    this.BUILD_DIR = 'build/';
                }
                this.CLIENT_DIST_DIR = this.BUILD_DIR + constants.CLIENT_DIST_DIR;
                // Make documentation URL available in templates
                this.DOCUMENTATION_URL = constants.JHIPSTER_DOCUMENTATION_URL;
                this.DOCUMENTATION_ARCHIVE_URL = `${constants.JHIPSTER_DOCUMENTATION_URL + constants.JHIPSTER_DOCUMENTATION_ARCHIVE_PATH}v${this.jhipsterVersion}`;
            }
        };
    }

    get configuring() {
        if (useBlueprint) return;
        return {
            insight() {
                const insight = this.insight();
                insight.trackWithEvent('generator', 'server');
                insight.track('app/authenticationType', this.authenticationType);
                insight.track('app/cacheProvider', this.cacheProvider);
                insight.track('app/enableHibernateCache', this.enableHibernateCache);
                insight.track('app/websocket', this.websocket);
                insight.track('app/databaseType', this.databaseType);
                insight.track('app/devDatabaseType', this.devDatabaseType);
                insight.track('app/prodDatabaseType', this.prodDatabaseType);
                insight.track('app/searchEngine', this.searchEngine);
                insight.track('app/messageBroker', this.messageBroker);
                insight.track('app/serviceDiscoveryType', this.serviceDiscoveryType);
                insight.track('app/buildTool', this.buildTool);
                insight.track('app/enableSocialSignIn', this.enableSocialSignIn);
                insight.track('app/enableSwaggerCodegen', this.enableSwaggerCodegen);
            },

            configureGlobal() {
                // Application name modified, using each technology's conventions
                this.angularAppName = this.getAngularAppName();
                this.camelizedBaseName = _.camelCase(this.baseName);
                this.dasherizedBaseName = _.kebabCase(this.baseName);
                this.lowercaseBaseName = this.baseName.toLowerCase();
                this.humanizedBaseName = _.startCase(this.baseName);
                this.mainClass = this.getMainClassName();

                this.pkType = this.getPkType(this.databaseType);

                this.packageFolder = this.packageName.replace(/\./g, '/');
                this.testDir = `${constants.SERVER_TEST_SRC_DIR + this.packageFolder}/`;
                if (!this.nativeLanguage) {
                    // set to english when translation is set to false
                    this.nativeLanguage = 'en';
                }
            },

            saveConfig() {
                this.config.set('entityName', "TestEnt");
                this.config.set('jhipsterVersion', packagejs.version);
                this.config.set('baseName', this.baseName);
                this.config.set('packageName', this.packageName);
                this.config.set('packageFolder', this.packageFolder);
                this.config.set('serverPort', this.serverPort);
                this.config.set('authenticationType', this.authenticationType);
                this.config.set('uaaBaseName', this.uaaBaseName);
                this.config.set('cacheProvider', this.cacheProvider);
                this.config.set('enableHibernateCache', this.enableHibernateCache);
                this.config.set('websocket', this.websocket);
                this.config.set('databaseType', this.databaseType);
                this.config.set('devDatabaseType', this.devDatabaseType);
                this.config.set('prodDatabaseType', this.prodDatabaseType);
                this.config.set('searchEngine', this.searchEngine);
                this.config.set('messageBroker', this.messageBroker);
                this.config.set('serviceDiscoveryType', this.serviceDiscoveryType);
                this.config.set('buildTool', this.buildTool);
                this.config.set('enableSocialSignIn', this.enableSocialSignIn);
                this.config.set('enableSwaggerCodegen', this.enableSwaggerCodegen);
                this.config.set('jwtSecretKey', this.jwtSecretKey);
                this.config.set('rememberMeKey', this.rememberMeKey);
                this.config.set('enableTranslation', this.enableTranslation);
                if (this.enableTranslation && !this.configOptions.skipI18nQuestion) {
                    this.config.set('nativeLanguage', this.nativeLanguage);
                    /* this.config.set('languages', this.languages); */
                }
            }
        };
    }

    get default() {
        if (useBlueprint) return;
        return {
            getSharedConfigOptions() {
                this.useSass = this.configOptions.useSass ? this.configOptions.useSass : false;
                if (this.configOptions.enableTranslation !== undefined) {
                    this.enableTranslation = this.configOptions.enableTranslation;
                }
                if (this.configOptions.nativeLanguage !== undefined) {
                    this.nativeLanguage = this.configOptions.nativeLanguage;
                }
                if (this.configOptions.languages !== undefined) {
                    this.languages = this.configOptions.languages;
                }
                if (this.configOptions.testFrameworks) {
                    this.testFrameworks = this.configOptions.testFrameworks;
                }
                if (this.configOptions.clientFramework) {
                    this.clientFramework = this.configOptions.clientFramework;
                }
                this.protractorTests = this.testFrameworks.includes('protractor');
                this.gatlingTests = this.testFrameworks.includes('gatling');
                this.cucumberTests = this.testFrameworks.includes('cucumber');
            },

            /* composeLanguages() {
                if (this.configOptions.skipI18nQuestion) return;

                this.composeLanguagesSub(this, this.configOptions, 'server');
            } */
        };
    }

    get writing() {
        if (useBlueprint) return;
        return writeFiles();
    }

    end() {
        if (useBlueprint) return;

        this.log(chalk.green.bold('\nServer application generated successfully.\n'));

        this.log(chalk.green('Run your Spark application:' + '\n ') +
			     chalk.green('run first') + chalk.yellow.bold(' mvn compile') + chalk.green(' and for start application \n ') +
			     chalk.yellow.bold('mvn exec:java -Dexec.mainClass="' + this.packageName + '.' + this.mainClass + '"\n'));
    }
};
