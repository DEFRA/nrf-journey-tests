-- Seed WWTW catchment polygons near the test boundary centroid (582819, 328198).
-- Two catchments at different distances so we can test the multi-option UI.

-- WWTW catchment 1: ~1 km east of the test boundary
INSERT INTO nrf_reference.spatial_layer (id, version, geometry, name, attributes, layer_type, created_at)
VALUES (
  gen_random_uuid(),
  1,
  ST_SetSRID(
    ST_GeomFromText('POLYGON((583700 328100, 583900 328100, 583900 328300, 583700 328300, 583700 328100))'),
    27700
  ),
  'Test WWTW Catchment A',
  '{"WwTw_ID": "101"}'::jsonb,
  'WWTW_CATCHMENTS',
  NOW()
);

-- WWTW catchment 2: ~3 km north of the test boundary
INSERT INTO nrf_reference.spatial_layer (id, version, geometry, name, attributes, layer_type, created_at)
VALUES (
  gen_random_uuid(),
  1,
  ST_SetSRID(
    ST_GeomFromText('POLYGON((582700 331100, 582900 331100, 582900 331300, 582700 331300, 582700 331100))'),
    27700
  ),
  'Test WWTW Catchment B',
  '{"WwTw_ID": "202"}'::jsonb,
  'WWTW_CATCHMENTS',
  NOW()
);

-- WWTW name lookup table — maps WwTw_ID to human-readable names
INSERT INTO nrf_reference.lookup_table (id, name, version, data, description, created_at)
VALUES (
  gen_random_uuid(),
  'wwtw_lookup',
  1,
  '[
    {"wwtw_code": 101, "wwtw_name": "East Rudham WRC"},
    {"wwtw_code": 202, "wwtw_name": "Fakenham WWTP"}
  ]'::jsonb,
  'Test WwTW permits and characteristics',
  NOW()
);
