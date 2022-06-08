import { render } from 'react-dom';
import './style.css';
import { Table } from 'react-bootstrap';
import AlertDismissable from './AlertDismissable';
import { useState } from 'react';
import React, { StrictMode } from 'react';
import Select from 'react-select';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
export default function App() {
  return (
    <div className="App">
      <h1>Create configuration</h1>
      <Configurations />
    </div>
  );
}
const Configurations = () => {
  let [state, setState] = useState(configObj);

  const updateSubOption = (subOption) => {
    var newState = JSON.parse(JSON.stringify(state));
    for (const [key, value] of Object.entries(
      newState.home_insurance.user_registeration_data
    )) {
      if (value.parameters)
        for (const [key2, value2] of Object.entries(value.parameters)) {
          if (value2.id === subOption.id) {
            newState.home_insurance.user_registeration_data[key].parameters[
              key2
            ] = subOption;
          }
        }
    }

    setState(newState);
  };
  const prepareStateForExport = () => {
    var newState = JSON.parse(JSON.stringify(state));
    var id = state.id;
    for (const [key, value] of Object.entries(
      newState.home_insurance.user_registeration_data
    )) {
      if (value.parameters) {
        var keys = Object.keys(value.parameters).filter(
          (key) => value.parameters[key].enabled
        );
        var newDict = {};
        keys.forEach((a) => {
          newDict[a] = value.parameters[a];
          delete newDict[a].id;
          delete newDict[a].enabled;
        });
        value.parameters = newDict;

        for (const [key2, value2] of Object.entries(value.parameters)) {
        }
      }
    }
    newState.id = id;
    setState(newState);
    console.log('exported State:', newState);
  };
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ padding: 10, width: '50%', overflow: 'hidden' }}>
        Registration segment
        <br />
        <br />
        {Object.keys(state.home_insurance.user_registeration_data)
          .filter((one) => one !== 'dynamic_variables')
          .map((entry) => {
            return (
              <div
                key={entry}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <br /> <br /> <br />
                <div style={{ fontSize: '2em' }}>{entry}</div> <br /> <br />
                {Object.keys(
                  state.home_insurance.user_registeration_data[entry]
                )
                  .filter((a) => a == 'parameters')
                  .map((one2) => {
                    return (
                      <OneOption
                        key={
                          state.home_insurance.user_registeration_data[entry][
                            one2
                          ]
                        }
                        updateSubOption={updateSubOption}
                        option={
                          state.home_insurance.user_registeration_data[entry][
                            one2
                          ]
                        }
                      ></OneOption>
                    );
                  })}
              </div>
            );
          })}
        <br />
        <br />
        <Button
          onClick={() => {
            prepareStateForExport();
          }}
        >
          configure
        </Button>
        <div> outputJson:</div>
        {
          <div>
            <pre>{JSON.stringify(state, null, 2)}</pre>
          </div>
        }
      </div>
      <div style={{ padding: 10, width: '50%', backgroundColor: 'grey' }}>
        {' '}
      </div>
    </div>
  );
  const RightMenu = () => {};
};

const OneOption = (props) => {
  return (
    <div>
      {Object.keys(props.option).map((key) => (
        <SubOption
          key={key}
          updateSubOption={props.updateSubOption}
          subOption={props.option[key]}
        />
      ))}
    </div>
  );
};

const TypeSelectExtra = (props) => {
  var ret;
  // const [state, setState] = useState(props.subOption);
  // console.log("typeSelect:", state);
  switch (props.subOption.type) {
    case 'text':
      // console.log('selected type text...');
      // props.updateSubOption({ ...props.subOption, type: "Text" });
      ret = null;
      break;
    case 'bool':
      ret = (
        <div>
          <Form.Label htmlFor="inputPassword5">
            define bool ui facing values to choose from:
          </Form.Label>
          <Form.Control
            type="password"
            id="inputPassword5"
            aria-describedby="passwordHelpBlock"
          />
          <Form.Control
            type="password"
            id="inputPassword5"
            aria-describedby="passwordHelpBlock"
          />
        </div>
      );
      break;
    default:
      ret = null;
      break;
  }
  // console.log("ret:", ret);
  return ret;
};

const SubOption = (props) => {
  const options = [
    { value: 'Text', label: 'text' },
    { value: 'bool', label: 'bool' },
    { value: 'Multiselect', label: 'Multiselect' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check
          onClick={(e) => {
            props.updateSubOption({
              ...props.subOption,
              enabled: props.subOption.enabled ? false : true,
            });
          }}
          type="checkbox"
          label={
            props.subOption.uititle
              ? props.subOption.uititle
              : props.subOption.uititle
          }
        />
      </Form.Group>

      {props.subOption.enabled ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <br />

            <Form.Label htmlFor="inputPassword5">
              user facing ui label title
            </Form.Label>
            <Form.Control
              value={props.subOption.uititle}
              onChange={(e) =>
                props.updateSubOption({
                  ...props.subOption,
                  uititle: e.target.value,
                })
              }
            />

            <br />
            <label htmlFor="typeSelect">Return type:</label>
            <Select
              value={{
                value: props.subOption.type,
                label: props.subOption.type,
              }}
              onChange={(e) => {
                console.log('e:', e);
                props.updateSubOption({ ...props.subOption, type: e.value });
              }}
              options={options}
            />
            <br />
          </div>

          {props.subOption.type == 'bool' ? (
            <TypeSelectExtra
              updateSubOption={props.updateSubOption}
              subOption={props.subOption}
            />
          ) : null}
        </div>
      ) : null}
      <br />
    </div>
  );
};

var configObj = {
  id: '001',
  type: 'client',
  version: 2,

  home_insurance: {
    background_color: '#FFFFFF',
    font: 'Times new roman',
    bankid_enabled: true,
    chatbot_enabled: false,
    max_data_age: {
      spar: 36000,
      checkbiz: 0,
      source_a: 60,
    },
    user_registeration_data: {
      user_adress: {
        parameters: {
          country: {
            id: '12321',
            uititle: 'country',
            type: 'text',
            manual: 'true',
            mandatory: 'true',
          },
          address: {
            id: '83t3764',
            uititle: 'address',
            type: 'text',
            manual: 'true',
            mandatory: 'true',
          },
          city: {
            id: '93663754',
            uititle: 'city',
            type: 'text',
            manual: 'true',
            mandatory: 'true',
          },
          zipcode: {
            id: '62572365',
            dbsource: 'zipcode',
            uititle: 'zipcode',
            type: 'text',
            manual: 'true',
            mandatory: 'true',
          },
          homeType: {
            id: '325618237',
            uititle: 'home Type',
            type: 'text',
            manual: 'true',
            mandatory: 'true',
          },
          ownershiType: {
            id: '2629614623',
            uititle: 'ownership Type',
            type: 'text',
            manual: 'true',
            mandatory: 'true',
          },
          residentalArea: {
            id: '8326265383',
            uititle: 'residental Area',
            type: 'text',
            manual: 'true',
            mandatory: 'true',
          },
          populationRegisterAddress: {
            id: '117763873',
            uititle: 'Population register address',
            type: 'text',
            manual: 'true',
            mandatory: 'true',
          },
        },
        source: {
          primary: {
            name: 'checkbiz',
          },
          backup: {
            name: 'manual',
          },
        },
      },
      user_basic: {
        parameters: {
          socialSecurityNumber: {
            id: '937676532',
            uititle: 'Social security number',
            manual: 'true',
            mandatory: 'true',
          },
          email: {
            id: '93676576543',
            uititle: 'Email',
            manual: 'true',
            mandatory: 'true',
          },
          firstName: {
            id: '2762763',
            uititle: 'first name',
            type: 'text',
            manual: 'true',
            mandatory: 'true',
          },
          lastName: {
            id: '92542564564',
            uititle: 'last name',
            type: 'text',
            manual: 'false',
            mandatory: 'false',
          },
          middleName: {
            id: '277638762',
            uititle: 'gender',
            type: 'bool',
            manual: 'true',
            mandatory: 'false',
          },
        },
        source: {
          primary: {
            name: 'checkbiz',
          },
          backup: {
            name: 'spar',
          },
        },
      },
      user_phone: {
        parameters: {
          primaryPhone: {
            id: '5277772565',
            uititle: 'Primary phone',
            type: 'text',
            manual: 'true',
            mandatory: 'true',
          },
          phoneNumber: {
            id: '44453876376',
            uititle: 'Phone number',
            type: 'text',
            manual: 'true',
            mandatory: 'true',
          },
        },
        source: {
          primary: {
            name: 'checkbiz',
          },
          backup: {
            name: 'manual',
          },
        },
      },
      dynamic_variables: {
        dog_name: {
          mandatory: false,
          type: 'string',
          label: {
            sv: 'Namn',
            en: 'Name',
          },
          source: {
            primary: {
              name: 'checkbiz',
              field: 'registeredDogsAtAddress.dogs.name',
            },
            backup: {
              name: 'manual',
            },
          },
        },
      },
    },
    background_color: '#FFFFFF',
    font: 'Times new roman',
  },
  dynamic_car: {
    bankid_enabled: false,
    client_logotype: 'S3://path_to_client_logotyp/logo.png',
  },
};

render(<App />, document.getElementById('root'));
