-- Seed a test EDP boundary that intersects the BnW_small_under_1_hectare test fixture.
-- The fixture polygon spans approximately (582808-582831, 328188-328211) in EPSG:27700.
-- This larger envelope guarantees intersection.
INSERT INTO nrf_reference.edp_boundary_layer (id, version, geometry, name, attributes, created_at)
VALUES (
  gen_random_uuid(),
  1,
  ST_SetSRID(
    ST_GeomFromText('POLYGON((582800 328180, 582840 328180, 582840 328220, 582800 328220, 582800 328180))'),
    27700
  ),
  'Test EDP Boundary',
  '{"Label": "Test EDP", "N2K_Site_N": "Test N2K Site"}'::jsonb,
  NOW()
);
