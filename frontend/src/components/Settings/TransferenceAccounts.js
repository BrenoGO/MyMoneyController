import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Select from '../Select';
import helper from '../../services/helper';

import { SettingsService } from '../../services/SettingsService';

import { updateDefault } from '../../actions/DefaultsActions';

export default function TransferenceAccounts() {
  const { defaultAccounts } = useSelector(state => state.DefaultsReducer);
  const accounts = useSelector(state => state.AccountsReducer.accounts);

  const whereAccountsToSelect = helper.organizedAccounts(
    accounts,
    defaultAccounts.currentAccounts
  );

  const [chosenAccounts, setChosenAccounts] = useState({
    from: defaultAccounts.transferences.from,
    to: defaultAccounts.transferences.to,
  });

  const dispatch = useDispatch();

  async function changeTransfAccounts() {
    const setting = await SettingsService.update('defaultAccounts', {
      data: {
        ...defaultAccounts,
        transferences: {
          from: chosenAccounts.from,
          to: chosenAccounts.to,
        }
      }
    });
    dispatch(updateDefault('defaultAccounts', setting.data));
  }

  return (
    <div id="transferenceAccountsDiv">
      <div id="transfAcHeader">
        <h3>Transference Accounts:</h3>
      </div>
      <div id="TransfAcContent">
        <div id="selectTransfFrom" className="selectAccount">
          <div id="transfFromSelectorLabel">From:</div>
          <Select
            value={chosenAccounts.from}
            onChange={id => setChosenAccounts({ ...chosenAccounts, from: id })}
            options={whereAccountsToSelect.map(account => ({
              value: account.id,
              disabled: !account.allowValue,
              label: account.name
            }))}
          />
        </div>
        <div id="selectTransfTo" className="selectAccount">
          <div id="TransfToAccountSelectorLabel">To:</div>
          <Select
            value={chosenAccounts.to}
            onChange={id => setChosenAccounts({ ...chosenAccounts, to: id })}
            options={whereAccountsToSelect.map(account => ({
              value: account.id,
              disabled: !account.allowValue,
              label: account.name
            }))}
          />
        </div>
      </div>
      {
        ((defaultAccounts.transferences.from !== chosenAccounts.from)
        || (defaultAccounts.transferences.to !== chosenAccounts.to))
          && (
            <div id="diffAcDiv">
              <button type="button" className="but-primary-neutral" onClick={changeTransfAccounts}>
                Save Changes
              </button>
            </div>
          )
      }
    </div>

  );
}
