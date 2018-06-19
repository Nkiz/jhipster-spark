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
const _ = require('lodash');
const randexp = require('randexp');
const chalk = require('chalk');
const utils = require('../utils');
const mkdirp = require('mkdirp');
const cleanup = require('../cleanup');
const constants = require('../generator-constants');

/* Constants use throughout */
const INTERPOLATE_REGEX = constants.INTERPOLATE_REGEX;
const DOCKER_DIR = constants.DOCKER_DIR;
const TEST_DIR = constants.TEST_DIR;
const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
const SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;
const SERVER_TEST_SRC_DIR = constants.SERVER_TEST_SRC_DIR;
const SERVER_TEST_RES_DIR = constants.SERVER_TEST_RES_DIR;

const serverFiles = {
	    server: [
	        {
	            path: SERVER_MAIN_SRC_DIR,
	            templates: [
	                {
	                    file: 'package/domain/_Entity.java',
	                    renameTo: generator => `${generator.packageFolder}/domain/${generator.entity.entityName}.java`
	                }
	            ]
	        },
	        {
	            path: SERVER_MAIN_SRC_DIR,
	            templates: [
	                {
	                    file: 'package/domain/_ImpCodec.java',
	                    renameTo: generator => `${generator.packageFolder}/domain/${generator.entity.entityName}ImpCodec.java`
	                }
	            ]
	        }
	    ]
	};

module.exports = {
    writeFiles,
    serverFiles
};

let javaDir;

function writeFiles() {
    return {
    	
    	writeServerFiles() {
    		_.each(this.entities, newEntity => {
    			this.entity = newEntity;
    			this.writeFilesToDisk(serverFiles, this, false);
    		});
        },

        setUpJavaDir() {
            javaDir = this.javaDir = `${constants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;
        },

        cleanupOldServerFiles() {
            cleanup.cleanupOldServerFiles(this, this.javaDir, this.testDir);
        },

        writeGlobalFiles() {
            this.template('_README.md', 'README.md');
            this.template('gitignore', '.gitignore');
            this.copy('gitattributes', '.gitattributes');
            this.copy('editorconfig', '.editorconfig');
        },

        writeDockerFiles() {
            // Create Docker and Docker Compose files
            this.template(`${DOCKER_DIR}_Dockerfile`, `${DOCKER_DIR}Dockerfile`);
            this.template(`${DOCKER_DIR}.dockerignore`, `${DOCKER_DIR}.dockerignore`);
            this.template(`${DOCKER_DIR}_app.yml`, `${DOCKER_DIR}app.yml`);

            if (this.prodDatabaseType === 'mongodb') {
                this.template(`${DOCKER_DIR}_mongodb.yml`, `${DOCKER_DIR}mongodb.yml`);
                this.template(`${DOCKER_DIR}_mongodb-cluster.yml`, `${DOCKER_DIR}mongodb-cluster.yml`);
                this.template(`${DOCKER_DIR}mongodb/MongoDB.Dockerfile`, `${DOCKER_DIR}mongodb/MongoDB.Dockerfile`);
                this.template(`${DOCKER_DIR}mongodb/scripts/init_replicaset.js`, `${DOCKER_DIR}mongodb/scripts/init_replicaset.js`);
            }
			
            if (this.enableSwaggerCodegen) {
                this.template(`${DOCKER_DIR}_swagger-editor.yml`, `${DOCKER_DIR}swagger-editor.yml`);
            }

            if (this.authenticationType === 'oauth2') {
                this.template(`${DOCKER_DIR}_keycloak.yml`, `${DOCKER_DIR}keycloak.yml`);
                this.template(`${DOCKER_DIR}config/realm-config/_jhipster-realm.json`, `${DOCKER_DIR}realm-config/jhipster-realm.json`);
                this.copy(`${DOCKER_DIR}config/realm-config/jhipster-users-0.json`, `${DOCKER_DIR}realm-config/jhipster-users-0.json`);
            } 
        },

        writeServerBuildFiles() {
			this.copy('mvnw', 'mvnw');
			this.copy('mvnw.cmd', 'mvnw.cmd');
			this.copy('.mvn/wrapper/maven-wrapper.jar', '.mvn/wrapper/maven-wrapper.jar');
			this.copy('.mvn/wrapper/maven-wrapper.properties', '.mvn/wrapper/maven-wrapper.properties');
			this.template('_pom.xml', 'pom.xml', null, { interpolate: INTERPOLATE_REGEX });
        },

//        writeServerResourceFiles() {
//            // Create Java resource files
//            mkdirp(SERVER_MAIN_RES_DIR);
//        },

        writeServerJavaAppFiles() {
            // Create Java files
            // Java Spark main
            this.template(`${SERVER_MAIN_SRC_DIR}package/_Application.java`, `${javaDir}/${this.mainClass}.java`);
            /* this.template(`${SERVER_MAIN_SRC_DIR}package/_ApplicationWebXml.java`, `${javaDir}/ApplicationWebXml.java`); */
        },
		
		writeDatabaseFiles() {
			this.template(`${SERVER_MAIN_SRC_DIR}package/database/_DatabaseService.java`, `${javaDir}/database/DatabaseService.java`);
			
		},
		
		writeEntityFiles() {
//			this.fields.forEach((field) => {
//				const fieldType = field.fieldType;
//				const fieldName = field.fieldName;
				//this.template(`${SERVER_MAIN_SRC_DIR}package/domain/_Entity.java`, `${javaDir}/domain/${this.entityName}.java`);
//			});
			//this.template(`${SERVER_MAIN_SRC_DIR}package/domain/_Entity.java`, `${javaDir}/domain/Coffee.java`);
			// write server side files
            //this.writeFilesToDisk(serverFiles, this, false);
			//this.template(`${SERVER_MAIN_SRC_DIR}package/domain/_ImpCodec.java`, `${javaDir}/domain/CoffeeImpCodec.java`);
		},
		
		writeAuthFiles() {
			this.template(`${SERVER_MAIN_SRC_DIR}package/auth/_CustomConfigFactory.java`, `${javaDir}/auth/CustomConfigFactory.java`);
			this.template(`${SERVER_MAIN_SRC_DIR}package/auth/_CustomHttpActionAdapter.java`, `${javaDir}/auth/CustomHttpActionAdapter.java`);
			this.template(`${SERVER_MAIN_SRC_DIR}package/auth/_LoginController.java`, `${javaDir}/auth/LoginController.java`);
		},
		
		writeConfigFiles() {
			this.template(`${SERVER_MAIN_SRC_DIR}package/config/_LocalConfig.java`, `${javaDir}/config/LocalConfig.java`);
		},
      
    };
}
