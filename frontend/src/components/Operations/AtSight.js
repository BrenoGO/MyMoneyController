import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import './operations.css';

import internacionalization from '../../services/Internacionalization';
import { RegistersService } from '../../services/RegistersService';

import { resetBalance } from '../../actions/AccountsActions';

import Select from '../Select';

export default function AtSight(props) {
  const { organizedAccounts } = props;

  const defaults = useSelector(state => (state.AccountsReducer.defaults));
  const dispatch = useDispatch();

  const [opValue, setOpValue] = useState(internacionalization.getInitials() !== 'pt-BR' ? '$ 0.00' : 'R$ 0,00');
  const [opDesc, setOpDesc] = useState('');
  const [opNotes, setOpNotes] = useState('');
  const [whatAccountId, setWhatAccountId] = useState(defaults.defaultAccounts.whatId);
  const [whereAccountId, setWhereAccountId] = useState(
    defaults.defaultAccounts.whereId
  );
  const [whatAccounts, setWhatAccounts] = useState({ id: 2, name: 'expense' });
  const [emitDate, setEmitDate] = useState(new Date());

  const currentAccounts = organizedAccounts(3);
  const whatAccountsToSelect = organizedAccounts(whatAccounts.id);

  useEffect(() => {
    if (defaults.defaultAccounts.whereId) setWhereAccountId(defaults.defaultAccounts.whereId);
    if (defaults.defaultAccounts.whatId) setWhatAccountId(defaults.defaultAccounts.whatId);
  }, [defaults]);

  function editOpValue(value) {
    setOpValue(internacionalization.currencyFormatter(value));
  }

  function reSetState() {
    setOpValue(internacionalization.getInitials() !== 'pt-BR' ? '$ 0.00' : 'R$ 0,00');
    setOpDesc('');
    setOpNotes('');
    setWhatAccountId(defaults.defaultAccounts.whatId);
    setWhereAccountId(defaults.defaultAccounts.whereId);
    setWhatAccounts({ id: 2, name: 'expense' });
    setEmitDate(new Date());
  }
  function submit() {
    const lastWhereAccountBalance = defaults.balances.filter(
      item => item.accountId === whereAccountId
    )[0].balance;

    const value = internacionalization.toNumber(opValue);
    if (value === 0) return alert('value is 0!');

    const whereAccountBalance = lastWhereAccountBalance + value;
    reSetState();
    dispatch(resetBalance({ accountId: whereAccountId, balance: whereAccountBalance }));
    const Obj = {
      opType: `${whatAccounts.name}AtSight`,
      whereAccountId,
      whatAccountId,
      whereAccountBalance,
      value,
    };

    if (opDesc) Obj.description = opDesc;
    if (opNotes) Obj.notes = opNotes;

    return RegistersService.store(Obj);
  }

  return (
    <>
      <div id="divSelectExpenseOrIncome">
        <div>
          Emit date:
          {' '}
          <DatePicker selected={emitDate} onChange={d => setEmitDate(d)} />
        </div>
        <label htmlFor="selectExpenseOrIncome">
          Expense or Income:
          <select
            id="selectExpenseOrIncome"
            value={whatAccounts.name}
            onChange={e => setWhatAccounts(
              e.target.value === 'expense' ? { id: 2, name: 'expense' } : { id: 1, name: 'income' }
            )}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>
      </div>
      <div id="selectWhereAccount" className="selectAccount">
        <div id="whereAccountsSelectorLabel">Current Account:</div>
        <Select
          id="whereAccountsSelector"
          value={whereAccountId}
          onChange={setWhereAccountId}
          options={currentAccounts.map(account => ({
            value: account.id,
            disabled: !account.allowValue,
            label: account.name
          }))}
        />
      </div>
      <div id="selectWhatAccount" className="selectAccount">
        <div id="whatAccountSelectorLabel">What Account:</div>
        <Select
          id="whatAccountSelector"
          value={whatAccountId}
          onChange={setWhatAccountId}
          options={whatAccountsToSelect.map(account => ({
            value: account.id,
            disabled: !account.allowValue,
            label: account.name
          }))}
        />
      </div>
      <div id="divValue">
        <label htmlFor="opValue">
          Value:
          <input type="text" id="opValue" value={opValue} onChange={e => editOpValue(e.target.value)} />
        </label>
      </div>
      <div id="divDescription">
        <label htmlFor="opDesc">
          Description:
          <input type="text" id="opDesc" value={opDesc} onChange={e => setOpDesc(e.target.value)} />
        </label>
      </div>
      <div id="divNotes">
        <label htmlFor="opNotes">
          Notes:
          <input type="text" id="opNotes" value={opNotes} onChange={e => setOpNotes(e.target.value)} />
        </label>
      </div>
      <div id="divButRegister">
        <button type="button" className="but-primary-neutral" onClick={submit}>Register</button>
      </div>
    </>
  );
}
