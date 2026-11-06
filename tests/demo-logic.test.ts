import test from 'node:test';
import assert from 'node:assert/strict';
import { filterArtists, initialDraft, validateDraft, artists } from '../src/lib/data';
test('discovery combines search, genre and city and handles empty results',()=>{
  assert.deepEqual(filterArtists({search:'  NOVA  ',genre:'Alternative R&B',city:'Bristol, UK',collection:'New artists'}).map(a=>a.slug),['nova-reign']);
  assert.equal(filterArtists({search:'nova',genre:'Electronic',city:'Everywhere',collection:'New artists'}).length,0);
  assert.equal(filterArtists({search:'',genre:'All genres',city:'Everywhere',collection:'New artists'}).length,artists.length);
});
test('collections sort by actual demo count and restrict editorial favourites',()=>{
  const popular=filterArtists({search:'',genre:'All genres',city:'Everywhere',collection:'Most stanned'});
  assert.equal(popular[0].slug,'atlas-noir');
  for(let i=1;i<popular.length;i++) assert.ok(popular[i-1].count>=popular[i].count);
  assert.ok(filterArtists({search:'',genre:'All genres',city:'Everywhere',collection:'Our favourites'}).every(a=>a.favourite));
});
test('wizard rejects missing identity, unsafe handles and invalid bio lengths',()=>{
  assert.ok(validateDraft(initialDraft,0));
  assert.ok(validateDraft({...initialDraft,name:'Nova',handle:'hello/world'},0));
  assert.equal(validateDraft({...initialDraft,name:'Nova',handle:'nova-reign'},0),null);
  assert.ok(validateDraft(initialDraft,1));
  assert.equal(validateDraft({...initialDraft,bio:'Songs for the journey home.'},1),null);
});
test('wizard allows optional links and rejects script, HTTP and credential URLs',()=>{
  assert.equal(validateDraft(initialDraft,2),null);
  for(const link of ['javascript:alert(1)','http://example.com','not a link','https://user:password@example.com']) assert.ok(validateDraft({...initialDraft,link},2));
  assert.equal(validateDraft({...initialDraft,link:'https://bandcamp.com'},2),null);
});
