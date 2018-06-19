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

const crypto = require('crypto');
const chalk = require('chalk');
const path = require('path');
const _ = require('lodash');
const jhiCore = require('jhipster-core');
const shelljs = require('shelljs');

const constants = require('../generator-constants');

module.exports = {
    askForModuleName,
    askForServerSideOpts,
	askForFields
};

function askForModuleName() {
    if (this.baseName) return;
    this.entities = [];
    this.fields = [];
    this.askModuleName(this);
}

function askForServerSideOpts(meta) {
    if (!meta && this.existingProject) return;

    const applicationType = this.applicationType;
    let defaultPort = applicationType === 'gateway' ? '8080' : '8081';
    if (applicationType === 'uaa') {
        defaultPort = '9999';
    }
    const prompts = [
        {
            when: response => (applicationType === 'gateway' || applicationType === 'microservice' || applicationType === 'uaa'),
            type: 'input',
            name: 'serverPort',
            validate: input => (/^([0-9]*)$/.test(input) ? true : 'This is not a valid port number.'),
            message: 'As you are running in a microservice architecture, on which port would like your server to run? It should be unique to avoid port conflicts.',
            default: defaultPort
        },
        {
            type: 'input',
            name: 'packageName',
            validate: input => (/^([a-z_]{1}[a-z0-9_]*(\.[a-z_]{1}[a-z0-9_]*)*)$/.test(input) ?
                true : 'The package name you have provided is not a valid Java package name.'),
            message: 'What is your default Java package name?',
            default: 'com.mycompany.myapp',
            store: true
        },
        {
            when: response => (
                (applicationType === 'monolith' && response.serviceDiscoveryType !== 'eureka') ||
                ['gateway', 'microservice'].includes(applicationType)
            ),
            type: 'list',
            name: 'authenticationType',
            message: `Which ${chalk.yellow('*type*')} of authentication would you like to use?`,
            choices: (response) => {
                const opts = [
                    {
                        value: 'oauth2',
                        name: 'OAuth 2.0 / OIDC Authentication (stateful, works with Keycloak and Okta)'
                    }
                ];
                return opts;
            },
            default: 0
        },
        {
            when: response => ((applicationType === 'gateway' || applicationType === 'microservice') && response.authenticationType === 'uaa'),
            type: 'input',
            name: 'uaaBaseName',
            message: 'What is the folder path of your UAA application?',
            default: '../uaa',
            validate: (input) => {
                const uaaAppData = this.getUaaAppName(input);

                if (uaaAppData && uaaAppData.baseName && uaaAppData.applicationType === 'uaa') {
                    return true;
                }
                return `Could not find a valid JHipster UAA server in path "${input}"`;
            }
        },
        {
            type: 'list',
            name: 'databaseType',
            message: `Which ${chalk.yellow('*type*')} of database would you like to use?`,
            choices: (response) => {
                const opts = [
                    {
                        value: 'mongodb',
                        name: 'MongoDB'
                    },
                ];
                return opts;
            },
            default: 0
        },
       
        {
            type: 'list',
            name: 'buildTool',
            message: 'Would you like to use Maven or Gradle for building the backend?',
            choices: [
                {
                    value: 'maven',
                    name: 'Maven'
                },
                /* {
                    value: 'gradle',
                    name: 'Gradle'
                } */
            ],
            default: 'maven'
        }
    ];

    if (meta) return prompts; // eslint-disable-line consistent-return

    const done = this.async();

    this.prompt(prompts).then((props) => {
        this.serviceDiscoveryType = props.serviceDiscoveryType;
        this.authenticationType = props.authenticationType;

        // JWT authentication is mandatory with Eureka, so the JHipster Registry
        // can control the applications
        if (this.serviceDiscoveryType === 'eureka' && this.authenticationType !== 'uaa' && this.authenticationType !== 'oauth2') {
            this.authenticationType = 'jwt';
        }

        if (this.authenticationType === 'session') {
            this.rememberMeKey = crypto.randomBytes(20).toString('hex');
        }

        if (this.authenticationType === 'jwt' || this.applicationType === 'microservice') {
            this.jwtSecretKey = crypto.randomBytes(20).toString('hex');
        }

        // user-management will be handled by UAA app, oauth expects users to be managed in IpP
        if ((this.applicationType === 'gateway' && this.authenticationType === 'uaa') || this.authenticationType === 'oauth2') {
            this.skipUserManagement = true;
        }

        if (this.applicationType === 'uaa') {
            this.authenticationType = 'uaa';
        }

        this.packageName = props.packageName;
        this.serverPort = props.serverPort;
        if (this.serverPort === undefined) {
            this.serverPort = '8080';
        }
        /* this.cacheProvider = props.cacheProvider;
        this.enableHibernateCache = props.enableHibernateCache; */
        this.databaseType = props.databaseType;
        this.devDatabaseType = props.devDatabaseType;
        this.prodDatabaseType = props.prodDatabaseType;
        /* this.searchEngine = props.searchEngine; */
        this.buildTool = props.buildTool;
        this.uaaBaseName = this.getUaaAppName(props.uaaBaseName).baseName;

        if (this.databaseType === 'no') {
            this.devDatabaseType = 'no';
            this.prodDatabaseType = 'no';
            this.enableHibernateCache = false;
        } else if (this.databaseType === 'mongodb') {
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
        }
        done();
    });
}

function askForFields() {
    const context = this.context;


    /*if (context.updateEntity === 'add') {
        logFieldsAndRelationships.call(this);
    }*/
	const prompts = [
		{
            type: 'list',
            name: 'addEntity',
            message: 'Do you want to add an Entity?',
            choices: [
                {
                    value: false,
                    name: 'No'
                },
                {
                    value: true,
                    name: 'Yes'
                }
            ],
            default: false
        },
		{
			when: response => response.addEntity === true,
            type: 'input',
            name: 'entityName',
            message: 'What is the name of the entity?',
            store: true,
            validate: (input) => {
				return true;
            }
        },
	];
    const done = this.async();
	this.prompt(prompts).then((props) => {
		if(props.addEntity)
		{	
			var tempEntityLc = props.entityName.toLowerCase();
			const entity = {
                entityName: props.entityName,
                entityLc: tempEntityLc
	        };
			this.entity = props.entityName;
			this.entities.push(entity);
			askForField.call(this, done);
		}else{
			done();
		}
	});
}


function askForField(done) {
    const context = this.context;
    //this.log(chalk.green(`\nGenerating field #${context.fields.length + 1}\n`));
    //const skipServer = context.skipServer;
    //const prodDatabaseType = context.prodDatabaseType;
    //const databaseType = context.databaseType;
    //const fieldNamesUnderscored;
    const prompts = [
        {
            type: 'confirm',
            name: 'fieldAdd',
            message: 'Do you want to add a field to your entity?',
            default: true
        },
        {
            when: response => response.fieldAdd === true,
            type: 'input',
            name: 'fieldName',
            validate: (input) => {
                if (!(/^([a-zA-Z0-9_]*)$/.test(input))) {
                    return 'Your field name cannot contain special characters';
                } else if (input === '') {
                    return 'Your field name cannot be empty';
                } else if (input.charAt(0) === input.charAt(0).toUpperCase()) {
                    return 'Your field name cannot start with an upper case letter';
                } else if (input === 'id') {
                    return 'Your field name cannot use an already existing field name';
                /*} else if (!skipServer && jhiCore.isReservedFieldName(input)) {
                    return 'Your field name cannot contain a Java or Angular reserved keyword';
                } else if (prodDatabaseType === 'oracle' && input.length > 30) {
                    return 'The field name cannot be of more than 30 characters';*/
                }
                return true;
            },
            message: 'What is the name of your field?'
        },
        {
            when: response => response.fieldAdd === true,
            type: 'list',
            name: 'fieldType',
            message: 'What is the type of your field?',
            choices: [
                {
                    value: 'String',
                    name: 'String'
                },
                {
                    value: 'int',
                    name: 'Integer'
                },
                {
                    value: 'long',
                    name: 'Long'
                },
                {
                    value: 'float',
                    name: 'Float'
                },
                {
                    value: 'double',
                    name: 'Double'
                },
                /*{
                    value: 'BigDecimal',
                    name: 'BigDecimal'
                },
                {
                    value: 'LocalDate',
                    name: 'LocalDate'
                },
                {
                    value: 'Instant',
                    name: 'Instant'
                },
                {
                    value: 'ZonedDateTime',
                    name: 'ZonedDateTime'
                },
                {
                    value: 'Boolean',
                    name: 'Boolean'
                },
                {
                    value: 'enum',
                    name: 'Enumeration (Java enum type)'
                },
                {
                    value: 'byte[]',
                    name: '[BETA] Blob'
                }*/
            ],
            default: 0
        },
    ];
    this.prompt(prompts).then((props) => {
        if (props.fieldAdd) {
        	var tempUc = props.fieldName.toUpperCase();
            const field = {
            	entityName: this.entity,
                fieldName: props.fieldName,
                fieldNameUc: tempUc,
                fieldType: props.fieldType
            };

            //fieldNamesUnderscored.push(_.snakeCase(props.fieldName));
            this.fields.push(field);
        }
        //logFieldsAndRelationships.call(this);
        if (props.fieldAdd) {
            askForField.call(this, done);
        } else {
			askForFields.call(this);
        }
    });
}
