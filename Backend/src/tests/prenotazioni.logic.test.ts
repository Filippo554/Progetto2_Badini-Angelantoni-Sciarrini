import test from 'node:test';
import assert from 'node:assert/strict';
import { getWeekRange, isValidTimeRange, normalizeOptionalText, rangesOverlap } from '../utils/prenotazioni';
import { PrenotazioniService } from '../services/prenotazioni.service';

test('rangesOverlap rileva sovrapposizione correttamente', () => {
  assert.equal(rangesOverlap({ ora_inizio: '08:00', ora_fine: '10:00' }, { ora_inizio: '09:00', ora_fine: '11:00' }), true);
  assert.equal(rangesOverlap({ ora_inizio: '08:00', ora_fine: '10:00' }, { ora_inizio: '10:00', ora_fine: '11:00' }), false);
});

test('isValidTimeRange accetta solo intervalli crescenti', () => {
  assert.equal(isValidTimeRange('08:00', '09:00'), true);
  assert.equal(isValidTimeRange('09:00', '09:00'), false);
  assert.equal(isValidTimeRange('10:00', '09:00'), false);
});

test('normalizeOptionalText pulisce stringhe vuote', () => {
  assert.equal(normalizeOptionalText('  test  '), 'test');
  assert.equal(normalizeOptionalText('   '), null);
  assert.equal(normalizeOptionalText(null), null);
});

test('getWeekRange restituisce lunedi e domenica della settimana', () => {
  assert.deepEqual(getWeekRange('2026-04-16'), { lunedi: '2026-04-13', domenica: '2026-04-19' });
});

test('assertCanModify consente admin e proprietario', async () => {
  await assert.doesNotReject(() =>
    PrenotazioniService.assertCanModify(
      { id: 99, email: 'admin@test.it', ruolo: 'admin' },
      { utente_id: 1 } as any,
    ),
  );

  await assert.doesNotReject(() =>
    PrenotazioniService.assertCanModify(
      { id: 5, email: 'doc@test.it', ruolo: 'docente' },
      { utente_id: 5 } as any,
    ),
  );
});

test('assertCanModify blocca un docente su prenotazione altrui', async () => {
  await assert.rejects(
    () =>
      PrenotazioniService.assertCanModify(
        { id: 5, email: 'doc@test.it', ruolo: 'docente' },
        { utente_id: 7 } as any,
      ),
    /solo le tue prenotazioni/i,
  );
});
