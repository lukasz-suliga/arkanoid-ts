import json
import random

background_images = [
    "./images/background_6.png",
    "./images/background_7.png",
    "./images/background_8.jpeg",
    "./images/background_9.jpeg",
    "./images/background_10.jpeg",
    "./images/background_11.jpeg",
    "./images/background_12.jpeg",
    "./images/background_13.jpeg",
    "./images/background_14.jpeg",
]

# Function to generate levels
def generate_levels(num_levels):
    levels = []
    for i in range(num_levels):
        level = {
            "columnCount": random.randint(6, 9),
            "backgroundImage": random.choice(background_images),
            "bricks": []
        }
        
        row_count = random.randint(3, 9)
        color_indexes = random.sample(range(10), row_count)  # Ensure unique color indexes

        for color_index in color_indexes:
            brick = {
                "health": random.choice([1, 2]),
                "colorIndex": color_index
            }
            level["bricks"].append(brick)
        
        levels.append(level)
    
    return levels

levels_data = generate_levels(10)

# Print JSON to check the structure
levels_json = json.dumps(levels_data, indent=4)
print(levels_json)
