from app.database import SessionLocal
from app.models.standard import Standard

BIS_SOURCE = 'https://standards.bis.gov.in/'

standards = [
('IS 456:2000','Plain and Reinforced Concrete — Code of Practice','Concrete','Plain concrete, reinforced concrete, RCC, structural concrete, construction, building works, concrete design'),
('IS 10262:2019','Concrete Mix Proportioning — Guidelines','Concrete','Concrete mix design, mix proportioning, M20, M25, M30, RCC, construction'),
('IS 4926:2003','Ready-Mixed Concrete — Code of Practice','Concrete','Ready mix concrete, RMC, batching, delivery, placement, construction'),
('IS 11384:2022','Composite Construction in Structural Steel and Concrete — Code of Practice','Construction','Composite construction, structural steel, concrete, building structures'),
('IS 15658:2006','Precast Concrete Blocks for Paving — Specification','Construction Materials','Concrete paving blocks, paver blocks, pavement, precast concrete'),
('IS 9142 (Part 2):2018','Artificial Lightweight Aggregate for Concrete — Sintered Fly Ash Coarse Aggregate','Construction Materials','Lightweight aggregate, fly ash aggregate, concrete aggregate'),
('IS 1786:2008','High Strength Deformed Steel Bars and Wires for Concrete Reinforcement — Specification','Steel','TMT bars, reinforcement steel, rebar, deformed bars, concrete reinforcement, Fe 415, Fe 500, Fe 550'),
('IS 2062:2011','Hot Rolled Medium and High Tensile Structural Steel — Specification','Steel','Structural steel, hot rolled steel, plates, sections, construction steel'),
('IS 432 (Part 1):1982','Mild Steel and Medium Tensile Steel Bars and Hard-Drawn Steel Wire for Concrete Reinforcement — Part 1 Mild Steel and Medium Tensile Steel Bars','Steel','Mild steel bars, reinforcement bars, concrete reinforcement, construction'),
('IS 432 (Part 2):1982','Mild Steel and Medium Tensile Steel Bars and Hard-Drawn Steel Wire for Concrete Reinforcement — Part 2 Hard-Drawn Steel Wire','Steel','Steel wire, reinforcement wire, concrete reinforcement'),
('IS 280:2006','Mild Steel Wire for General Engineering Purposes — Specification','Steel','Mild steel wire, engineering wire, wire products'),
('IS 2266:2024','Steel Wire Ropes for General Engineering Purposes','Steel','Steel wire rope, lifting, engineering, ropes'),
('IS 2026 (Part 1):2011','Power Transformers — Part 1 General','Transformers','Power transformer, high voltage transformer, transformer specification, electrical substation'),
('IS 2026 (Part 3):2018','Power Transformers — Part 3 Insulation Levels, Dielectric Tests and External Clearances in Air','Transformers','Transformer testing, dielectric test, insulation level, high voltage'),
('IS 2026 (Part 5):2011','Power Transformers — Part 5 Ability to Withstand Short Circuit','Transformers','Power transformer, short circuit withstand, transformer testing'),
('IS 1180 (Part 3):2021','Outdoor/Indoor Type Liquid Immersed Distribution Transformers Up to and Including 2500 kVA, 33 kV — Part 3 Natural/Synthetic Organic Ester Liquid Immersed','Transformers','Distribution transformer, 33 kV, liquid immersed transformer, ester transformer'),
('IS 694:2010','Polyvinyl Chloride Insulated Unsheathed and Sheathed Cables/Cords with Rigid and Flexible Conductor for Rated Voltages up to and Including 1100 V','Cables','PVC cable, electrical cable, power cable, 1100 V cable, wiring'),
('IS 1554 (Part 1):1988','PVC Insulated Heavy Duty Electric Cables — Part 1 For Working Voltages up to and Including 1100 V','Cables','PVC heavy duty cable, electrical cable, power cable, 1100 V'),
('IS 1554 (Part 2):1988','PVC Insulated Heavy Duty Electric Cables — Part 2 For Working Voltages from 3.3 kV up to and Including 11 kV','Cables','PVC cable, medium voltage cable, 3.3 kV, 6.6 kV, 11 kV'),
('IS 7098 (Part 1):1988','Crosslinked Polyethylene Insulated Thermoplastic Sheathed Cables — Part 1 For Working Voltages up to and Including 1100 V','Cables','XLPE cable, electrical cable, 1100 V, power cable'),
('IS 9968 (Part 1):1988','Elastomer Insulated Cables — Part 1 For Working Voltages up to and Including 1100 V','Cables','Elastomer cable, flexible electrical cable, 1100 V'),
('IS 3480:2024','Flexible Steel Conduits for Electrical Wiring','Electrical Installation','Flexible steel conduit, electrical wiring, cable protection, wiring installation'),
('IS 9537 (Part 3):1983','Conduits for Electrical Installations — Part 3 Rigid Plain Conduits of Insulating Materials','Electrical Installation','Electrical conduit, PVC conduit, wiring installation, cable protection'),
('IS 1293:2019','Plugs and Socket-Outlets for Household and Similar Purposes of Rated Voltage up to and Including 250 V and Rated Current up to and Including 16 A — Specification','Electrical Accessories','Electrical plug, socket, 250 V, 16 A, household electrical accessories'),
('IS 302 (Part 1):2024','Household and Similar Electrical Appliances — Safety Part 1 General Requirements','Electrical Appliances','Electrical appliance safety, household appliance, safety requirements'),
('IS 3854:2023','Switches for Domestic and Similar Purposes — Specification','Electrical Accessories','Electrical switch, domestic switch, wiring accessories'),
('IS 14772:2020','Boxes and Enclosures for Electrical Accessories for Household and Similar Fixed Electrical Installations — General Requirements','Electrical Installation','Electrical junction box, enclosure, electrical accessories, wiring'),
('IS 369:2019','Household Electric Direct-Acting Room Heaters — Performance Requirements','Electrical Appliances','Room heater, electric heater, household appliance'),
('IS 2082:2018','Stationary Storage Type Electric Water Heaters — Specification','Electrical Appliances','Electric geyser, water heater, storage water heater, household appliance'),
('IS 4246:2025','Domestic Gas Stove and Built-in Hob for Use with LPG — Specification','Domestic Appliances','LPG gas stove, built-in hob, domestic cooking appliance'),
('IS 8034:2018','Submersible Pumpsets — Specification','Water Pumps','Submersible pump, borewell pump, water pump, irrigation, water supply'),
('IS 14220:2018','Openwell Submersible Pumpsets — Specification','Water Pumps','Openwell pump, submersible pump, water supply, irrigation'),
('IS 9079:2018','Monoset Pumps for Clear, Cold Water for Agricultural and Water Supply Purposes — Specification','Water Pumps','Monoset pump, agricultural pump, water supply pump, clear cold water'),
('IS 6595 (Part 1):2018','Horizontal Centrifugal Pumps for Clear, Cold Water — Part 1 Agricultural and Rural Water Supply Purposes','Water Pumps','Centrifugal pump, agricultural pump, rural water supply, clear cold water'),
('IS 9283:2013','Motors for Submersible Pumpsets — Specification','Water Pumps','Submersible pump motor, borewell pump motor, water pumping'),
('IS 8472:2019','Centrifugal Regenerative Pumps for Clear, Cold Water — Specification','Water Pumps','Regenerative pump, centrifugal pump, water pump'),
('IS 4984:2016','Polyethylene Pipes for Water Supply — Specification','Water Supply','PE pipe, polyethylene pipe, water supply, HDPE pipe'),
('IS 4985:2021','Unplasticized PVC Pipes for Potable Water Supplies — Specification','Water Supply','UPVC pipe, PVC water pipe, potable water, drinking water supply'),
('IS 12701:1996','Rotational Moulded Polyethylene Water Storage Tanks — Specification','Water Storage','Water storage tank, polyethylene tank, plastic water tank'),
('IS 14333:1996','High Density Polyethylene Pipe for Sewerage','Water & Sewerage','HDPE sewer pipe, sewerage, drainage, polyethylene pipe'),
('IS 14286 (Part 2):2023','Terrestrial Photovoltaic (PV) Modules Design Qualification and Type Approval — Part 2 Test Procedures','Solar PV','Solar panel, photovoltaic module, PV module, solar testing'),
('IS 14286 (Part 1):2019','Terrestrial Photovoltaic (PV) Modules — Design Qualification and Type Approval — Part 1 Test Requirements','Solar PV','Solar panel, photovoltaic module, PV module, solar testing'),
('IS 16077:2024','Thin-Film Terrestrial Photovoltaic (PV) Modules — Design Qualification and Type Approval','Solar PV','Thin film solar panel, PV module, photovoltaic module'),
('IS 16221 (Part 2):2015','Safety of Power Converters for Use in Photovoltaic Power Systems — Part 2 Particular Requirements for Inverters','Solar PV','Solar inverter, PV inverter, photovoltaic power converter, inverter safety'),
('IS 16270:2014','Test Procedure of Islanding Prevention Measures for Utility-Interconnected Photovoltaic Inverters','Solar PV','Solar inverter, grid connected inverter, islanding protection'),
('IS 17018 (Part 1):2022','Solar Photovoltaic Water Pumping Systems — Part 1 Centrifugal Pumps','Solar Water Pump','Solar water pump, photovoltaic pumping, centrifugal pump, irrigation'),
('IS 12834:2023','Solar Photovoltaic Energy Systems — Terms and Definitions','Solar PV','Solar PV system, photovoltaic energy, solar terminology'),
('IS 10322 (Part 1):2026','Luminaires — Part 1 General Requirements and Tests','Lighting','Luminaire, LED light, lighting fixture, lighting safety'),
('IS 10322 (Part 5/Sec 3):2026','Luminaires — Part 5 Particular Requirements Section 3 Luminaires for Road and Street Lighting','Lighting','LED street light, road lighting, street lighting luminaire'),
('IS 16107 (Part 2/Sec 2):2017','Luminaires Performance — Part 2 Particular Requirements Section 2 LED Street Lighting Luminaire','Lighting','LED street light, LED luminaire, street lighting performance'),
]

db = SessionLocal()
try:
    added = 0
    updated = 0
    for is_number, title, category, scope in standards:
        existing = db.query(Standard).filter(Standard.is_number == is_number).first()
        if existing:
            existing.title = title
            existing.category = category
            existing.scope = scope
            existing.source_url = BIS_SOURCE
            updated += 1
        else:
            db.add(Standard(
                is_number=is_number,
                title=title,
                category=category,
                scope=scope,
                standard_type='Indian Standard',
                status='Reference',
                source_url=BIS_SOURCE,
            ))
            added += 1
    db.commit()
    print(f'Added: {added}')
    print(f'Updated: {updated}')
    print(f'Total records in this batch: {len(standards)}')
finally:
    db.close()
