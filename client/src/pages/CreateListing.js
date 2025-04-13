import React, { useState } from "react";
import axios from "axios";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import "../styles/CreateListing.css";


const CreateListing = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [landlordEmail, setLandlordEmail] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableUntil, setAvailableUntil] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [images, setImages] = useState([]);

  // New fields
  const [roomType, setRoomType] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [leaseLength, setLeaseLength] = useState("");
  const [billsIncluded, setBillsIncluded] = useState({ internet: false, electricity: false, water: false });
  const [rules, setRules] = useState({ noPets: false, noSmoking: false });
  const [landlordNote, setLandlordNote] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);


  const [autocomplete, setAutocomplete] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const onLoad = (autoC) => setAutocomplete(autoC);
  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      const formatted = place.formatted_address || place.name;
      setAddress(formatted);
  
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setLatitude(lat);
        setLongitude(lng);
      }
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("address", address);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("landlordEmail", landlordEmail);
    formData.append("availableFrom", availableFrom);
    formData.append("availableUntil", availableUntil);
    formData.append("propertyType", propertyType);
    formData.append("roomType", roomType);
    formData.append("furnishing", furnishing);
    formData.append("leaseLength", leaseLength);
    formData.append("landlordNote", landlordNote);
    formData.append("billsIncluded", JSON.stringify(billsIncluded));
    formData.append("rules", JSON.stringify(rules));
    
    features.split(",").forEach((feature) => {
      formData.append("features", feature.trim());
    });

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/listings/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Listing successfully created!");
    } catch (error) {
      alert("❌ Failed to create listing. Check console for debug.");
    }
  };

  return (
    <div className="create-listing-container">
      <h1>Create New Listing</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Address</label>
          {isLoaded && (
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input
                type="text"
                placeholder="Start typing address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Autocomplete>
          )}
        </div>


        <div className="form-group">
          <label>Price (€ per month)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        </div>

        <div className="form-group">
          <label>Features (comma-separated)</label>
          <input type="text" value={features} onChange={(e) => setFeatures(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Landlord Email</label>
          <input type="email" value={landlordEmail} onChange={(e) => setLandlordEmail(e.target.value)} required />
        </div>

        <div className="form-group date-fields">
          <div className="form-group">
            <label>Available From</label>
            <input type="date" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Available Until</label>
            <input type="date" value={availableUntil} onChange={(e) => setAvailableUntil(e.target.value)} required />
          </div>
        </div>

        <div className="form-group">
          <label>Property Type</label>
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} required>
            <option value="">Select</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="studio">Studio</option>
          </select>
        </div>

        <div className="form-group">
          <label>Room Type</label>
          <select value={roomType} onChange={(e) => setRoomType(e.target.value)} required>
            <option value="">Select</option>
            <option value="single">Single</option>
            <option value="shared">Shared</option>
            <option value="entire">Entire Place</option>
          </select>
        </div>

        <div className="form-group">
          <label>Furnishing</label>
          <select value={furnishing} onChange={(e) => setFurnishing(e.target.value)} required>
            <option value="">Select</option>
            <option value="furnished">Furnished</option>
            <option value="unfurnished">Unfurnished</option>
          </select>
        </div>

        <div className="form-group">
          <label>Lease Length</label>
          <select value={leaseLength} onChange={(e) => setLeaseLength(e.target.value)} required>
            <option value="">Select duration</option>
            <option value="3">3 months</option>
            <option value="6">6 months</option>
            <option value="9">9 months</option>
            <option value="12">12 months</option>
          </select>
        </div>

        <div className="form-group">
          <label>Bills Included</label>
          <div>
            <label><input type="checkbox" checked={billsIncluded.internet} onChange={(e) => setBillsIncluded({ ...billsIncluded, internet: e.target.checked })} /> Internet</label><br />
            <label><input type="checkbox" checked={billsIncluded.electricity} onChange={(e) => setBillsIncluded({ ...billsIncluded, electricity: e.target.checked })} /> Electricity</label><br />
            <label><input type="checkbox" checked={billsIncluded.water} onChange={(e) => setBillsIncluded({ ...billsIncluded, water: e.target.checked })} /> Water</label>
          </div>
        </div>

        <div className="form-group">
          <label>Rules</label>
          <div>
            <label><input type="checkbox" checked={rules.noPets} onChange={(e) => setRules({ ...rules, noPets: e.target.checked })} /> Pets</label><br />
            <label><input type="checkbox" checked={rules.noSmoking} onChange={(e) => setRules({ ...rules, noSmoking: e.target.checked })} /> Smoking</label>
          </div>
        </div>

        <div className="form-group">
          <label>Landlord Note</label>
          <textarea value={landlordNote} onChange={(e) => setLandlordNote(e.target.value)}></textarea>
        </div>

        <div className="form-group">
          <label>Upload Images</label>
          <input
            type="file"
            name="images"
            onChange={(e) => setImages(e.target.files)}
            multiple
            accept="image/png, image/jpeg, image/jpg, image/gif"
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Create Listing
        </button>
      </form>
    </div>
  );
};

export default CreateListing;