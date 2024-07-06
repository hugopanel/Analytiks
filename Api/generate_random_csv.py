import csv, random

# Define the number of events and session tokens
num_events = 500

# Define the pages and buttons
types = ["page_visit", "btn_click"]
pages = ["home", "about", "contact", "products", "productA", "productB"]
buttons = [
    "btn_header_home", "btn_header_about", "btn_header_contact", "btn_header_products",
    "btn_products_productA", "btn_products_productB",
    "btn_productA_buy", "btn_productA_readmore",
    "btn_productB_buy", "btn_productB_readmore",
    "btn_contact_send"
    ]
sessions = [
    "qwer", "tyui", "opas", "dfgh", "jklz", "xcvb", "nmqw", "erty", "uiop", "asdf"
]

# Generate random events
events = []
timestamp = 0
for _ in range(num_events):
    session = random.choice(sessions)
    event_type = random.choice(types)
    if event_type == "page_visit":
        page = random.choice(pages)
        events.append([event_type, page, session, timestamp])
    else:
        button = random.choice(buttons)
        events.append([event_type, button, session, timestamp])
    timestamp += random.randint(1, 10)

# Write events to CSV file
file_path = "events.csv"
with open(file_path, "w", newline="") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(["event", "actor", "session", "timestamp"])
    writer.writerows(events)
