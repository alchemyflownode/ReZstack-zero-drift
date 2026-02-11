import pickle

print("?? CHECKING DATA KEYS")
print("=" * 50)

with open('data/training/distilled/enhanced_distilled.pkl', 'rb') as f:
    data = pickle.load(f)

print(f"?? Data type: {type(data)}")
print(f"?? Keys: {list(data.keys())}")

# Show values for each key
for key in data.keys():
    val = data[key]
    print(f"\n?? Key: {key}")
    print(f"   Type: {type(val)}")
    if hasattr(val, 'shape'):
        print(f"   Shape: {val.shape}")
        print(f"   Dtype: {val.dtype}")
        if hasattr(val, 'min') and hasattr(val, 'max'):
            print(f"   Range: [{val.min():.2f}, {val.max():.2f}]")
    elif isinstance(val, (list, tuple)):
        print(f"   Length: {len(val)}")
        if len(val) > 0:
            print(f"   First item type: {type(val[0])}")
