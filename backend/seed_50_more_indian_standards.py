from app.database import SessionLocal
from app.models.standard import Standard

BIS_SOURCE = "https://standards.bis.gov.in/"

# Batch 2: 50 additional Indian Standards for the prototype knowledge base.
# These are spread across different procurement domains.
standards = [
    ("IS 2190:2024", "Selection, Installation and Maintenance of First-Aid Fire Extinguishers — Portable and Mobile — Code of Practice", "Fire Safety", "Selection, installation, maintenance and testing of portable and mobile fire extinguishers."),
    ("IS 15683:2018", "Portable Fire Extinguishers — Performance and Construction — Specification", "Fire Safety", "Performance and construction requirements for portable fire extinguishers."),
    ("IS 16018:2012", "Wheeled Fire Extinguishers — Performance and Construction — Specification", "Fire Safety", "Performance and construction requirements for wheeled fire extinguishers."),
    ("IS 884:2017", "First-Aid Hose-Reel for Fire Fighting — Specification", "Fire Safety", "Hose-reels intended for first-aid firefighting applications."),
    ("IS 636:2018", "Non-Percolating Flexible Fire-Fighting Delivery Hose — Specification", "Fire Safety", "Flexible delivery hose used for firefighting."),
    ("IS 2925:1984", "Industrial Safety Helmets — Specification", "Occupational Safety", "Industrial safety helmets for protection of workers."),
    ("IS 15298 (Part 1):2011", "Personal Protective Equipment — Safety Footwear — Part 1 Requirements", "Occupational Safety", "General requirements for safety footwear used as personal protective equipment."),
    ("IS 15298 (Part 4):2011", "Personal Protective Equipment — Safety Footwear — Part 4 Test Methods", "Occupational Safety", "Test methods for safety footwear."),
    ("IS 5983:1980", "Industrial Safety Belts and Harnesses — Specification", "Occupational Safety", "Safety belts and harnesses for industrial work at height."),
    ("IS 3521:1999", "Industrial Safety Gloves — Specification", "Occupational Safety", "Protective gloves for industrial applications."),
    ("IS 4990:2024", "Plywood for Concrete Shuttering Works — Specification", "Construction Materials", "Plywood used for concrete shuttering and formwork."),
    ("IS 1038:1983", "Steel Doors, Windows and Ventilators — Specification", "Construction", "Steel doors, windows and ventilators for building applications."),
    ("IS 2202 (Part 1):2023", "Wooden Flush Door Shutters — Solid Core Type — Plywood Face Panels", "Construction", "Wooden flush door shutters with plywood face panels."),
    ("IS 14846:2000", "Sluice Valve for Water Works Purposes — Specification", "Water & Sanitation", "Sluice valves for water works and pipelines."),
    ("IS 13592:2013", "Unplasticized PVC-U Pipes for Soil and Waste Discharge Systems", "Water & Sanitation", "PVC-U pipes for soil, waste discharge, ventilation and rainwater systems."),
    ("IS 9523:2017", "Ductile Iron Fittings for Pressure Pipes for Water, Gas and Sewage", "Water & Sanitation", "Ductile iron fittings used with pressure pipelines."),
    ("IS 5382:1985", "Rubber Sealing Rings for Water Supply, Drainage and Sewerage Pipelines", "Water & Sanitation", "Rubber sealing rings and jointing materials for pipelines."),
    ("IS 10500:2012", "Drinking Water — Specification", "Water Quality", "Requirements and quality parameters for drinking water."),
    ("IS 3025 (Part 1):1987", "Methods of Sampling and Test for Water and Wastewater — Part 1", "Water Quality", "Sampling and testing framework for water and wastewater."),
    ("IS 10592:1982", "Requirements for Chemical Oxygen Demand of Water and Wastewater", "Water Quality", "Testing-related requirements for chemical oxygen demand in water and wastewater."),
    ("IS 2713 (Part 1):1980", "Tubular Steel Poles for Overhead Power Lines — Part 1", "Electrical Infrastructure", "Tubular steel poles used for overhead power lines."),
    ("IS 1239 (Part 1):2004", "Steel Tubes, Tubulars and Other Wrought Steel Fittings — Part 1 Steel Tubes", "Industrial Materials", "Steel tubes for general engineering and fluid applications."),
    ("IS 1161:2014", "Steel Tubes for Structural Purposes — Specification", "Structural Steel", "Steel tubes used for structural purposes."),
    ("IS 1363 (Part 1):2023", "Hexagon Head Bolts, Screws and Nuts of Product Grade C — Part 1", "Fasteners", "Hexagon head bolts, screws and nuts for engineering applications."),
    ("IS 2879:1998", "Mild Steel for Metal Arc Welding Electrodes — Specification", "Welding", "Mild steel wire used in metal arc welding electrodes."),
    ("IS 6392:1971", "Steel Pipe Flanges — Specification", "Piping", "Steel pipe flanges for industrial piping systems."),
    ("IS 5504:1993", "Spiral Welded Pipes — Specification", "Piping", "Spiral welded steel pipes for engineering applications."),
    ("IS 2062:2011", "Hot Rolled Medium and High Tensile Structural Steel — Specification", "Structural Steel", "Hot rolled structural steel for construction and engineering applications."),
    ("IS 7283:1992", "Hot-Rolled Bars and Rods for Production of Bright Bars and Machined Parts", "Steel Products", "Hot-rolled steel bars and rods for engineering and machined components."),
    ("IS 14246:1995", "Continuously Pre-painted Galvanized Steel Sheets and Coils", "Steel Products", "Pre-painted galvanized steel sheets and coils."),
    ("IS 4658:2019", "Coated Paper and Board — Specification", "Paper & Packaging", "Coated paper and board products for industrial and commercial use."),
    ("IS 1943:1968", "A-Twill Jute Bags — Specification", "Packaging", "Jute bags for packaging and storage applications."),
    ("IS 3309:1977", "Ice-Cream — Specification", "Food", "Specification and quality requirements for ice-cream."),
    ("IS 2802:1964", "Ice Cream — Methods of Test", "Food Testing", "Methods for testing ice-cream products."),
    ("IS 2052:2023", "Compounded Feeds for Cattle — Specification", "Agriculture & Animal Feed", "Requirements for compounded cattle feed."),
    ("IS 12785:1997", "Irrigation Equipment — Strainer-Type Filters", "Agriculture & Irrigation", "Strainer-type filters used in irrigation systems."),
    ("IS 10805:1994", "Foot Valves, Reflux Valves, Non-Return Valves and Bore Valves for Agricultural Pumping Systems", "Agriculture & Irrigation", "Valves used in suction lines of agricultural pumping systems."),
    ("IS 11501:1986", "Engine Monoset Pumps for Clear, Cold, Fresh Water for Agricultural Purposes", "Agricultural Pumps", "Engine-driven monoset pumps for agricultural water supply."),
    ("IS 7538:1996", "Three-Phase Squirrel Cage Induction Motors for Centrifugal Pumps for Agricultural Applications", "Agricultural Pumps", "Three-phase induction motors used with agricultural centrifugal pumps."),
    ("IS 15633:2022", "Pneumatic Tyres for Passenger Car Vehicles — Diagonal and Radial Ply", "Automotive", "Pneumatic tyres for passenger car vehicles."),
    ("IS 15636:2022", "Pneumatic Tyres for Commercial Vehicles — Diagonal and Radial Ply", "Automotive", "Pneumatic tyres for commercial vehicles."),
    ("IS 17043 (Part 2):2024", "Shoes for General Purpose — Specification", "Footwear", "Requirements for shoes intended for general-purpose use."),
    ("IS 12823:2025", "Safety Requirements for Selected Consumer Products", "Consumer Products", "Safety requirements applicable to selected consumer products."),
    ("IS 5509:2021", "Fire Retardant Plywood — Specification", "Construction Materials", "Fire-retardant plywood for building and construction applications."),
    ("IS 2553 (Part 1):2018", "Safety Glass — Part 1 Architectural, Building and General Uses", "Building Materials", "Safety glass for architectural, building and general applications."),
    ("IS 9873 (Part 1):2019", "Safety of Toys — Part 1 Safety Aspects Related to Mechanical and Physical Properties", "Consumer Safety", "Mechanical and physical safety requirements for toys."),
    ("IS 10146:1982", "Polyethylene for Safe Use in Contact with Foodstuffs, Pharmaceuticals and Drinking Water", "Plastics & Packaging", "Polyethylene requirements for specified food, pharmaceutical and drinking-water contact uses."),
    ("IS 14885:2022", "Polyethylene Pipes for the Supply of Gaseous Fuels — Specification", "Gas Supply", "Polyethylene pipes intended for gaseous-fuel supply systems."),
    ("IS 15450:2004", "Polyethylene/Aluminium/Polyethylene Composite Pressure Pipes for Hot and Cold Water Supplies", "Plumbing", "Composite pressure pipes for hot and cold water supply."),
    ("IS 15652:2006", "Insulating Mats for Electrical Purposes — Specification", "Electrical Safety", "Insulating mats used for electrical safety."),
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
                scope=scope,
                category=category,
                standard_type="Indian Standard",
                status="Reference",
                source_url=BIS_SOURCE,
            ))
            added += 1

    db.commit()

    print(f"Added: {added}")
    print(f"Updated: {updated}")
    print(f"Total records in this batch: {len(standards)}")

finally:
    db.close()
