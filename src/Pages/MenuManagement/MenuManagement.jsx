import React, { useEffect, useRef, useState } from 'react';
import { compressImage, createFormData } from '../../utils'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import def from '../../assets/download.png'
import fb from '../../assets/fb.png'
import wp from '../../assets/wp.png'

import insta from '../../assets/instagram.png'
import location from '../../assets/location.png'
import add from '../../assets/add.png'

import call from '../../assets/call.png'
import minus from '../../assets/minus.png'
import eats from '../../assets/eats-logo.png'

import { useParams } from 'react-router-dom';
import NewMenuCreation from '../../Components/NewMenuCreation/NewMenuCreation.jsx';

import useFetchData from '../../utils/useApi.js';



import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const apiUrl = import.meta.env.VITE_API_URL;


export default function MenuManagement() {

    const { isLoading, error, fetchData, data } = useFetchData();

    const [sections, setSections] = useState([]);
    const fileInputRef = useRef(null);


    const [expandedCategories, setExpandedCategories] = useState({});
    const [isEditSectionFormVisible, setIsEditSectionFormVisible] = useState(false);
    const [isAddSectionFormVisible, setIsAddSectionFormVisible] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [itemName, setItemName] = useState('');
    const [itemDesc, setItemDesc] = useState('');
    const [firstPrice, setFirstPrice] = useState('');
    const [offerItems, setOfferItems] = useState([]);
    const [offerSectionId, setOfferSectionId] = useState(null);
    const [expanded, setExpanded] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [menuData, setMenuData] = useState(""); // Stored Location URL

    const [activeMoreIndex, setActiveMoreIndex] = useState(null); // Tracks which "more" menu is active
    const [activeSectionEditor, setActiveSectionEditor] = useState("items");
    const [activeItemEditor, setActiveItemEditor] = useState("details");
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeItemMoreIndex, setActiveItemMoreIndex] = useState(null);
    const [activeOfferMoreIndex, setActiveOfferMoreIndex] = useState(null);
    const [isSectionsLoading, setIsSectionsLoading] = useState(false);
    const [isMenuLoading, setIsMenuLoading] = useState(true);

    const [activeSectionMoreIndex, setActiveSectionMoreIndex] = useState(null); // Keep your existing section one too
    const [prices, setPrices] = useState(
        selectedItem?.item_prices?.map(p => ({
            label: p.label || '',
            price: p.price || ''
        })) || []
    ); const [extras, setExtras] = useState([]);
    const [phones, setPhones] = useState([]); // First number is default
    const [itemPayload, setItemPayload] = useState({ name: '', description: '', item_price: [], item_extras: [], first_price: '' });
    // payload












    /////////////////////////
    // Add these helper functions somewhere in your component
    const moveItemUp = async (sectionId, itemId) => {
        const sectionIndex = sections.findIndex(section => section.id === sectionId);
        if (sectionIndex === -1) return;

        const itemIndex = sections[sectionIndex].items.findIndex(item => item.id === itemId);
        if (itemIndex <= 0) return; // Can't move up if it's already first

        // Create a new array with the items reordered
        const newItems = [...sections[sectionIndex].items];
        [newItems[itemIndex - 1], newItems[itemIndex]] = [newItems[itemIndex], newItems[itemIndex - 1]];

        // Update the state with the new order
        const newSections = [...sections];
        newSections[sectionIndex] = {
            ...newSections[sectionIndex],
            items: newItems
        };

        // Generate the output object
        const output = {
            section_id: sectionId.toString(),
            items: newItems.map(item => ({ id: item.id }))
        };

        console.log("New order:", output); // Or send to your API
        await reorderingItems(output)
        setSections(newSections);
    };

    const reorderingSections = async (reorderedData) => {

        try {
            await fetchData("/api/sections/reorder", reorderedData);

            toast.success("تم الترتيب بنجاح")
        } catch (error) {
            console.error("Error updating Location account:", error);
            alert("Failed to update Location URL.");
        }
    };


    const reorderingItems = async (reorderedData) => {

        try {
            await fetchData("/api/items/reorder", reorderedData);

            toast.success("تم الترتيب بنجاح")
        } catch (error) {
            console.error("Error updating Location account:", error);
            alert("Failed to update Location URL.");
        }
    };



    const moveItemDown = async (sectionId, itemId) => {
        const sectionIndex = sections.findIndex(section => section.id === sectionId);
        if (sectionIndex === -1) return;

        const itemIndex = sections[sectionIndex].items.findIndex(item => item.id === itemId);
        if (itemIndex >= sections[sectionIndex].items.length - 1) return; // Can't move down if it's already last

        // Create a new array with the items reordered
        const newItems = [...sections[sectionIndex].items];
        [newItems[itemIndex], newItems[itemIndex + 1]] = [newItems[itemIndex + 1], newItems[itemIndex]];

        // Update the state with the new order
        const newSections = [...sections];
        newSections[sectionIndex] = {
            ...newSections[sectionIndex],
            items: newItems
        };

        // Generate the output object
        const output = {
            section_id: sectionId.toString(),
            items: newItems.map(item => ({ id: item.id }))
        };

        console.log("New order:", output); // Or send to your API
        await reorderingItems(output)
        setSections(newSections);
    };





    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination } = result;
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const sectionId = parseInt(source.droppableId);
        const sectionIndex = sections.findIndex(section => section.id === sectionId);

        const newItems = [...sections[sectionIndex].items];
        const [removed] = newItems.splice(source.index, 1);
        newItems.splice(destination.index, 0, removed);

        const newSections = [...sections];
        newSections[sectionIndex] = {
            ...newSections[sectionIndex],
            items: newItems
        };

        const output = {
            section_id: sectionId.toString(),
            items: newItems.map(item => ({ id: item.id }))
        };

        console.log("New order:", output); // Or send to your API
        await reorderingItems(output)
        setSections(newSections);
    };

    // Then wrap your sections in DragDropContext
    <DragDropContext onDragEnd={handleDragEnd}>
        {sections.length > 0 ? (sections.map((section, index) => (
            <div key={section.id} className={`category mt-2`}>
                {/* ... your section header code ... */}

                <Droppable droppableId={section.id.toString()}>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="category-items flex flex-col items-end overflow-hidden transition-max-height duration-500 ease-in-out"
                            style={{ maxHeight: expandedCategories[section.id] ? '500px' : '0px' }}
                        >
                            {section.items.map((item, itemIndex) => (
                                <Draggable key={item.id} draggableId={item.id.toString()} index={itemIndex}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            onClick={() => {
                                                openEditItemForm(event, item),
                                                    setSelectedItem(item)
                                            }}
                                            className="item p-2 mt-2 hover:bg-slate-200 cursor-pointer rounded-md w-[97%] flex gap-2 justify-between bg-white"
                                        >
                                            {/* Your item content */}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                            <div onClick={() => openAddItemForm(section.id)} className="add-item hover:bg-slate-50 hover:shadow-md cursor-pointer w-[97%] mt-2 shadow-sm flex justify-between bg-white p-3 rounded-lg">
                                <p> + Add Item </p>
                            </div>
                        </div>
                    )}
                </Droppable>
            </div>
        ))) : (
            <div className="empty-sections flex flex-col justify-center items-center">
                <i className="fa-solid fa-arrow-up"></i>
                <p>No Section add now!</p>
            </div>
        )}
    </DragDropContext>







    /////////////////////////////////////////////////////
    //section reorder
    // Section reordering logic
    const moveSection = async (sectionId, direction) => {
        const sectionIndex = sections.findIndex(s => s.id === sectionId);
        if (sectionIndex === -1) return;

        // Check move boundaries
        if ((direction === 'up' && sectionIndex <= 0) ||
            (direction === 'down' && sectionIndex >= sections.length - 1)) {
            return;
        }

        // Calculate new position
        const newIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;

        // Create new array with swapped sections
        const newSections = [...sections];
        [newSections[sectionIndex], newSections[newIndex]] =
            [newSections[newIndex], newSections[sectionIndex]];

        // Update state
        setSections(newSections);

        // Log the new order
        const menuId = newSections[0]?.menu_id; // Get menu_id from first section
        const orderLog = {
            menu_id: menuId ? menuId.toString() : 'unknown',
            sections: newSections.map(section => ({ id: section.id }))
        };

        console.log('New section order:', orderLog);
        await reorderingSections(orderLog)

    };

    // Helper functions for specific directions
    const moveSectionUp = (sectionId) => moveSection(sectionId, 'up');
    const moveSectionDown = (sectionId) => moveSection(sectionId, 'down');


    ///////////////////
    // offers reordering
    // Add these functions to your component
    const moveOfferItem = async (itemId, direction) => {
        const itemIndex = offerItems.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;

        // Check boundaries
        if ((direction === 'up' && itemIndex <= 0) ||
            (direction === 'down' && itemIndex >= offerItems.length - 1)) {
            return;
        }

        // Calculate new position
        const newIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;

        // Create new array with swapped items
        const newOfferItems = [...offerItems];
        [newOfferItems[itemIndex], newOfferItems[newIndex]] =
            [newOfferItems[newIndex], newOfferItems[itemIndex]];

        // Update state
        setOfferItems(newOfferItems);
        console.log(offerSectionId);

        // Log the new order (similar to regular items)
        const orderLog = {
            section_id: offerSectionId, // or your actual offers section ID
            items: newOfferItems.map(item => ({ id: item.id }))
        };

        console.log('New offer items order:', orderLog);
        await reorderingItems(orderLog)
    };

    // Helper functions
    const moveOfferItemUp = (itemId) => moveOfferItem(itemId, 'up');
    const moveOfferItemDown = (itemId) => moveOfferItem(itemId, 'down');
    ///////////////////////////////
    const closeMoreClick = () => {
        setActiveItemMoreIndex(null)
        setActiveOfferMoreIndex(null)

    }
    const handleItemMoreClick = (index) => {
        setActiveItemMoreIndex(activeItemMoreIndex === index ? null : index);
    };

    const handleOfferMoreClick = (index) => {
        setActiveOfferMoreIndex(activeOfferMoreIndex === index ? null : index);
    };

    // const handleItemDeleteClick = (item) => {
    //     // Your delete logic here
    // };


    // const handlePriceChange = (index, field, value) => {
    //     const updatedPrices = [...prices];
    //     updatedPrices[index][field] = value;
    //     setPrices(updatedPrices);
    // };

    function authHeader() {
        const accessToken = localStorage.getItem("token");
        //  if (user && user.accessToken) {
        if (accessToken) {
            // return { Authorization: 'Bearer ' + user.accessToken }; // for Spring Boot back-end
            return { "x-access-token": accessToken }; // for Node.js Express back-end
        } else {
            return {};
        }
    }


    const filterSections = (sections) => {
        if (!searchQuery) return sections;

        return sections.filter(section => {
            const sectionNameMatches = section.name.toLowerCase().includes(searchQuery.toLowerCase());
            const itemMatches = section.items.some(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            return sectionNameMatches || itemMatches;
        });
    };
    const filterItems = (items) => {
        if (!searchQuery) return items;

        return items.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    // Filter offer items
    const filterOfferItems = (items) => {
        if (!searchQuery) return items;

        return items.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };


    const getData = () => {

        let data = {};

        setItemPayload(data)

    }

    const handleChangeForUpdated = (e) => {//{name, descripyion}
        const { name, value } = e.target;
        setItemPayload({ ...itemPayload, [name]: value })
    }

    const handleChangeItemPrice = (index, e) => {// item_price:[]
        const { name, value } = e.target;
        let updatedPrices = [...itemPayload.item_price];
        updatedPrices[index] = { ...updatedPrices[index], [name]: value }
        setItemPayload({ ...itemPayload, item_price: updatedPrices })
    }

    // <form><input name='name' value={itemPayload.name} onChange={handleChangeForUpdated}></form>
    //map(item, index) => { retun <input name='label' value={item.label} onChange={(event)=>{handleChangeItemPrice(index, event)}}>}





    const [sectionFile, setSectionFile] = useState(null);
    const [itemFile, setItemFile] = useState(null);

    const [preview, setPreview] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [openMenu, setOpenMenu] = useState(null);
    const [openItemMenu, setOpenItemMenu] = useState(null);
    const [sectionToDelete, setSectionToDelete] = useState(null); // State to track the section being deleted
    const [itemToDelete, setItemToDelete] = useState(null); // State to track the section being deleted
    const [isUploading, setIsUploading] = useState(false);
    const [isSavingNewSection, setIsSavingNewSection] = useState(false);
    const [isSavingNewItem, setIsSavingNewItem] = useState(false);

    const [uploadProgress, setUploadProgress] = useState(0);


    const [scratchMenu, setScratchMenu] = useState(false); // State to track the section being deleted
    const [sampleMenu, setSampleMenu] = useState(false); // State to track the section being deleted

    const [draggingIndex, setDraggingIndex] = useState(null); // Index of the category being dragged
    const [hoveredIndex, setHoveredIndex] = useState(null); // Index of the category being hovered over
    const dragCategory = useRef(null); // Reference for the dragged category
    const draggedOverCategory = useRef(null); // Reference for the category being dragged over
    const [isAddItemFormVisible, setAddItemFormVisible] = useState(false); // Manage form visibility
    const [isAddOfferFormVisible, setAddOfferFormVisible] = useState(false); // Manage form visibility

    const [selectedSectionId, setSelectedSectionId] = useState(null); // Store the active section ID
    const [selectedSection, setSelectedSection] = useState(null);

    const [isEditItemFormVisible, setIsEditItemFormVisible] = useState(false);
    const [isEditOfferFormVisible, setIsEditOfferFormVisible] = useState(false);

    const [facebookUrl, setFacebookUrl] = useState(""); // Stored Facebook URL
    const [tempFacebookUrl, setTempFacebookUrl] = useState(""); // Temporary input value
    const [isFacebookDisabled, setIsFacebookDisabled] = useState(false);
    const [isUpdateFacebook, setIsUpdateFacebook] = useState(false);
    const [whatsAppUrl, setWhatsAppUrl] = useState("");
    const [isUpdateWhatsApp, setIsUpdateWhatsApp] = useState(false)
    const [isWhatsappDisabled, setIsWhatsAppDisabled] = useState(false)


    const [tempWhatsAppUrl, setTempWhatsAppUrl] = useState("");
    const [instagramUrl, setInstagramUrl] = useState(""); // Stored Instagram URL
    const [tempInstagramUrl, setTempInstagramUrl] = useState(""); // Temporary input value
    const [isInstagramDisabled, setIsInstagramDisabled] = useState(false);
    const [isUpdateInstagram, setIsUpdateInstagram] = useState(false);

    const [locationUrl, setLocationUrl] = useState(""); // Stored Location URL
    const [tempLocationUrl, setTempLocationUrl] = useState(""); // Temporary input value
    const [isLocationDisabled, setIsLocationDisabled] = useState(false);
    const [isUpdateLocation, setIsUpdateLocation] = useState(false);
    const [loading, setLoading] = useState(true);
    const menu_id = localStorage.getItem("menu") // Get  dynamically from the URL
    const m_id = localStorage.getItem("m_id") // Get  dynamically from the URL



    async function getOfferSectionWithItems(m_id) {
        try {
            const response = await fetchData(`/api/menu-offers-owner/${m_id}`);
            console.log("offerss section ", response);

            if (!response.data || response.data.message === "Sections not found") {
                console.log("No offer sections found for this menu");
                return { sectionId: null, items: [] };
            }

            // Find the offer section (is_offer = true)
            const offerSection = response.data.result[0]

            if (!offerSection) {
                console.log("No offer section found");
                return { sectionId: null, items: [] };
            }

            console.log(offerSection);

            // Save the section ID globally
            // offerSectionId = offerSection.id;

            // Process items with their images
            const itemsWithImages = await Promise.all(
                offerSection.items.map(async (item) => {
                    let itemImageUrl = null;
                    if (item.image) {
                        try {
                            const itemImageResponse = await axios.get(
                                `${apiUrl}/api/file/${item.image}`,
                                { responseType: "blob" }, {
                                headers: authHeader(),
                            }
                            );
                            itemImageUrl = URL.createObjectURL(itemImageResponse.data);
                        } catch (itemImageError) {
                            console.error("Error fetching item image:", itemImageError);
                        }
                    }
                    return { ...item, image_url: itemImageUrl };
                })
            );

            // Log the items before returning

            return {
                sectionId: offerSection.id,
                items: itemsWithImages,
                sectionData: {
                    name: offerSection.name,
                    description: offerSection.description
                }
            };

        } catch (error) {
            console.error("Error fetching offer section:", error);
            toast.error("حدث خطأ أثناء جلب قسم العروض");
            return { sectionId: null, items: [] };
        }
    }
    async function getSections(m_id) {
        try {
            const response = await axios.get(`${apiUrl}/api/menusection-owner/${m_id}`, {
                headers: authHeader(),
            }

            );
            console.log("fetch sections", response);


            if (!response.data || response.data.success == false
            ) {
                console.log("No sections found for this menu");
                setSections([]);
                setIsMenuLoading(false)
                return;
            }

            // Filter out sections where is_offer is true
            const nonOfferSections = response.data.result
            console.log(nonOfferSections);

            const sectionsWithImages = await Promise.all(
                nonOfferSections.map(async (section) => {  // Only process non-offer sections
                    let coverImageUrl = null;
                    if (section.cover_image) {
                        try {
                            const imageResponse = await axios.get(
                                `${apiUrl}/api/file/${section.cover_image}`,
                                { responseType: "blob" }
                            );
                            coverImageUrl = URL.createObjectURL(imageResponse.data);
                        } catch (imageError) {
                            console.error("Error fetching cover image:", imageError);
                        }
                    }

                    const itemsWithImages = await Promise.all(
                        section.items.map(async (item) => {
                            let itemImageUrl = null;
                            if (item.image) {
                                try {
                                    const itemImageResponse = await axios.get(
                                        `${apiUrl}/api/file/${item.image}`,
                                        { responseType: "blob" }, {
                                        headers: authHeader(),
                                    }
                                    );
                                    itemImageUrl = URL.createObjectURL(itemImageResponse.data);
                                } catch (itemImageError) {
                                    console.error("Error fetching item image:", itemImageError);
                                }
                            }
                            return { ...item, image_url: itemImageUrl };
                        })
                    );

                    return { ...section, cover_image_url: coverImageUrl, items: itemsWithImages };
                })
            );

            console.log("sections", sectionsWithImages);

            setSections(sectionsWithImages);

            setIsMenuLoading(false)



        } catch (error) {
            if (error.response?.status === 404) {
                console.log("Menu or sections not found");
                setSections([]);

            } else {
                console.error("Error fetching sections:", error);
                toast.error("حدث خطأ أثناء جلب الأقسام");
            }
        }
    }
    useEffect(() => {
        fetchMenuData(menu_id)
        getSections(m_id);
        fetchOfferItems(); // Call the function directly
    }, [menu_id]);

    const fetchOfferItems = async () => {
        const { sectionId, items } = await getOfferSectionWithItems(m_id);
        setOfferItems(items);
        setOfferSectionId(sectionId);
    };

    useEffect(() => {
        if (selectedItem) {
            setPrices(selectedItem.item_prices || []);
            setExtras(selectedItem.item_extras || []);
        }
    }, [selectedItem]);


    useEffect(() => {
        // Set a timer for 3 seconds
        // const timer = setTimeout(() => {
        //     setIsMenuLoading(false);
        // }, 1500);

        // Clean up the timer when component unmounts
        // return () => clearTimeout(timer);
    }, []);

    const createSample = async (m_id) => {
        try {
            console.log("meeenu id", m_id);

            // First verify we have a valid menu_id
            if (!m_id) {
                toast.error("No menu selected");
                return;
            }

            // Sample menu structure
            const sampleMenu = [
                {
                    sectionName: "الوجبات الرئيسية - Main Meals",
                    sectionDescription: "",

                },
                {
                    sectionName: "المقبلات - Appetizers",
                    sectionDescription: "",

                },
                {
                    sectionName: " المشروبات - Drinks",
                    sectionDescription: "",

                },
                {
                    sectionName: " الحلويات - Deserts",
                    sectionDescription: "",

                }
            ];

            // Create each section with its items
            for (const section of sampleMenu) {
                try {
                    // Create the section
                    const sectionResponse = await addSectionApi({
                        menu_id: m_id, // Make sure this is not null
                        name: section.sectionName,
                        note: section.sectionDescription
                    }, null);
                    // toggleAddFormVisibility()
                    setIsMenuLoading(false)
                    setIsAddSectionFormVisible(false)

                    // Get the section ID from response
                    // const secId = sectionResponse.data.id;

                    // Create items for this section
                    // for (const item of section.items) {
                    //     await addItemApi({
                    //         menu_id: m_id,
                    //         section_id: secId,
                    //         name: item.name,
                    //         description: item.description,
                    //         first_price: item.price
                    //     }, null);
                    // }
                } catch (sectionError) {
                    console.error(`Error creating section ${section.sectionName}:`, sectionError);
                    toast.error(`Failed to create ${section.sectionName} section`);
                    continue; // Continue with next section even if one fails
                }
            }

            // Refresh the sections to show the new data
            await getSections(m_id);
        } catch (error) {
            console.error("Error creating sample menu:", error);
            toast.error("Failed to create sample menu");
        }
    };


    const fetchPhones = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/contacts/${m_id}`,);
            console.log("phhhhhhhh", response);

            if (response.data.result.length > 0) {
                setPhones(response.data.result.map(contact => contact.phone)); // Assuming API returns an array of objects with a `phone` field
            } else {
                setPhones([""]); // Default input field if no numbers exist
            }
        } catch (error) {
            console.error("Error fetching phone numbers:", error);
        }
    };



    const fetchMenuData = async (menu_id) => {
        try {
            // Fetch menu settings
            console.log(menu_id);

            const response = await axios.get(`${apiUrl}/api/menu/${menu_id}`, {
                headers: authHeader(),
            });
            console.log("menu dataaa", response.data);


            // Check if current time >= end_time (one-time check)
            // Set menu settings
            setMenuData(response.data.result);
            console.log(menuData);


        } catch (error) {
            toast.error("er")
            console.error("Error fetching menu settings or images:", error);
        } finally {
            setLoading(false);
        }
    };


    const fetchSocialAccounts = async (menu_id) => {
        try {
            const response = await axios.get(`${apiUrl}/api/menusocial-owner/${menu_id}`, {
                headers: authHeader(),
            });
            console.log(response);

            if (response.data?.result) {
                console.log("social media", response.data.result);

                // ===== FACEBOOK =====
                const firstFacebook = response.data?.result.find((item) => item.platform === "facebook");
                if (firstFacebook) {
                    setTempFacebookUrl(firstFacebook.url);
                    setFacebookUrl(firstFacebook.url);
                    setIsFacebookDisabled(true);
                    setIsUpdateFacebook(true);
                }

                // ===== WHATSAPP =====
                const firstWhatsapp = response.data.result.find((item) => item.platform === "whatsapp");
                if (firstWhatsapp) {
                    const phoneNumber = firstWhatsapp.url.replace("https://wa.me/", "");
                    setTempWhatsAppUrl(phoneNumber);
                    setWhatsAppUrl(firstWhatsapp.url);
                    setIsWhatsAppDisabled(true);
                    setIsUpdateWhatsApp(true);
                }

                // ===== INSTAGRAM =====
                const firstInstagram = response.data.result.find((item) => item.platform === "instagram");
                if (firstInstagram) {
                    setTempInstagramUrl(firstInstagram.url);
                    setInstagramUrl(firstInstagram.url);
                    setIsInstagramDisabled(true);
                    setIsUpdateInstagram(true);
                }

                // ===== LOCATION (Google Maps) =====
                const firstLocation = response.data.result.find((item) => item.platform === "location");
                if (firstLocation) {
                    // Extract coordinates or place ID if needed
                    setTempLocationUrl(firstLocation.url);
                    setLocationUrl(firstLocation.url);
                    setIsLocationDisabled(true);
                    setIsUpdateLocation(true);
                }

            } else {
                console.log("No social accounts found for this menu.");
            }
        } catch (err) {
            console.error("Error fetching social accounts:", err);
            toast.error("حدث خطأ أثناء جلب روابط التواصل");
        } finally {
            setLoading(false);
        }
    };




    useEffect(() => {

        // fetchWhatsappAccount(m_id);
        // fetchLocationAccount(m_id);
        fetchPhones(m_id);
        fetchSocialAccounts(m_id)
        // fetchFacebookAccount(m_id);
        // fetchInstagramAccount(m_id);


    }, [m_id]);


    const handleSaveLocationClick = async () => {
        console.log("Saving:", tempLocationUrl);

        try {

            let socialData = {
                menu_id: m_id,
                platform: "location",
                url: tempLocationUrl, // Use tempLocationUrl directly
            }
            await axios.post(`${apiUrl}/api/social/update`, socialData, {
                headers: authHeader(),
            });

            setLocationUrl(tempLocationUrl); // Update stored URL
            setIsLocationDisabled(true); // Disable input after saving
            setIsUpdateLocation(true); // Show "Update" button
            toast.success("Location URL is added successfully!")
        } catch (error) {
            console.error("Error updating Location account:", error);
            alert("Failed to update Location URL.");
        }
    };

    // Handle Update Button Click
    const handleUpdateLocationClick = () => {
        setIsLocationDisabled(false); // Enable input
        setIsUpdateLocation(false); // Hide "Update", show "Save"
    };


    const handleSaveFacebookClick = async () => {

        try {
            console.log(m_id);
            let socialData = {
                menu_id: m_id,
                platform: "facebook",
                url: tempFacebookUrl, // Use tempFacebookUrl directly
            }
            console.log(socialData);

            const response = await axios.post(`${apiUrl}/api/social/update`, socialData, { headers: authHeader() });
            console.log("add facebook res", response);

            setFacebookUrl(tempFacebookUrl); // Update stored URL
            setIsFacebookDisabled(true); // Disable input after saving
            setIsUpdateFacebook(true); // Show "Update" button
            toast.success("Facebook URL is added successfully!")
        } catch (error) {
            console.error("Error updating Facebook account:", error);
            alert("Failed to update Facebook URL.");
        }
    };

    // Handle Update Button Click
    const handleUpdateFacebookClick = () => {
        setIsFacebookDisabled(false); // Enable input
        setIsUpdateFacebook(false); // Hide "Update", show "Save"
    };
    const handleSaveWhatsAppClick = async () => {

        try {
            const whatsappNumber = `https://wa.me/${tempWhatsAppUrl}`

            // console.log(m_id);
            let socialData = {
                menu_id: m_id,
                platform: "whatsapp",
                url: whatsappNumber, // Use tempWhatsAppUrl directly
            }

            const response = await axios.post(`${apiUrl}/api/social/update`, socialData, { headers: authHeader() });
            console.log("whts res", response);

            setWhatsAppUrl(tempWhatsAppUrl); // Update stored URL
            setIsWhatsAppDisabled(true); // Disable input after saving
            setIsUpdateWhatsApp(true); // Show "Update" button
            toast.success("Whatsapp URL is added successfully!")
        } catch (error) {
            console.error("Error updating WhatsApp account:", error);
            alert("Failed to update WhatsApp URL.");
        }
    };

    // Handle Update Button Click
    const handleUpdateWhatsAppClick = () => {
        setIsWhatsAppDisabled(false); // Enable input
        setIsUpdateWhatsApp(false); // Hide "Update", show "Save"
    };
    const handleSaveInstagramClick = async () => {
        console.log("Saving:", tempInstagramUrl);

        try {

            let socialData = {
                menu_id: m_id,
                platform: "instagram",
                url: tempInstagramUrl, // Use tempInstagramUrl directly
            }
            await axios.post(`${apiUrl}/api/social/update`, socialData, { headers: authHeader() });

            setInstagramUrl(tempInstagramUrl); // Update stored URL
            setIsInstagramDisabled(true); // Disable input after saving
            setIsUpdateInstagram(true); // Show "Update" button
            toast.success("Instagram URL is added successfully!")
        } catch (error) {
            console.error("Error updating Instagram account:", error);
            alert("Failed to update Instagram URL.");
        }
    };

    // Handle Update Button Click
    const handleUpdateInstagramClick = () => {
        setIsInstagramDisabled(false); // Enable input
        setIsUpdateInstagram(false); // Hide "Update", show "Save"
    };

    const openEditSectionForm = async (sectionId) => {
        console.log(" section id ", sectionId);
        setSelectedSectionId(sectionId)

        setIsEditSectionFormVisible(true);
        setIsAddSectionFormVisible(false)
        setIsEditItemFormVisible(false)
        setAddItemFormVisible(false)
        // setSelectedSectionId(sectionId);


        closeAddOfferForm()
        closeAddItemForm()
        closeAddSectionForm()
        closeEditItemForm()
        closeEditOfferForm()


    }


    const closeEditSectionForm = () => {
        console.log("clossseeees");

        setIsEditSectionFormVisible(false)
        setSectionFile(null)


    }


    const openEditItemForm = (event, item) => {
        event.preventDefault()

        setSelectedItem(item);
        setIsEditItemFormVisible(true);
        // closeAddOfferForm()
        setAddOfferFormVisible(false)
        // closeAddItemForm()
        setAddItemFormVisible(false)
        // closeAddSectionForm()
        setIsAddSectionFormVisible(false)
        // closeEditOfferForm()
        setIsEditOfferFormVisible(false)
        // closeEditSectionForm()
        setIsEditSectionFormVisible()

    };
    const openEditOfferForm = (item) => {
        console.log(item);
        closeAddOfferForm()
        closeAddItemForm()
        closeAddSectionForm()
        closeEditItemForm()
        closeEditSectionForm()


        setSelectedItem(item);
        setIsEditOfferFormVisible(true);
    };


    const closeEditItemForm = () => {
        setIsEditItemFormVisible(false);

        setSelectedItem(null);
        setItemFile(null)
        setPreview(null)
    };

    const closeEditOfferForm = () => {
        setIsEditOfferFormVisible(false);

        setSelectedItem(null);
        setItemFile(null)
        setPreview(null)

    };


    async function handleAddOfferSubmit(event) {
        event.preventDefault();
        const itemObject = {
            menu_id: m_id,
            section_id: offerSectionId,
            name: itemName,
            description: itemDesc,
            first_price: firstPrice

        }
        let toastMessage = "تم اضافة العرض بنجاح"

        try {
            // Await the API call to ensure completion
            await addItemApi(itemObject, itemFile, toastMessage);

            await fetchOfferItems()
            // Fetch the updated sections after adding the new section
            await getOfferSectionWithItems(m_id);
            await getSections(m_id)
            // Clear the input fields
            setItemName('');
            setItemDesc('');
            setItemFile(null);
            setPreview(null)
            setFirstPrice('')


        } catch (error) {
            console.error('Error adding section:', error);
            toast.error('حدث خطأ أثناء اضافة المنتج');
        }


    }


    async function handleAddItemSubmit(event) {
        event.preventDefault();

        const nameRegex = /^.{1,60}$/;

        if (!itemName) {
            toast.error('يجب اضافة اسم للصنف');
            return;
        } else if (!nameRegex.test(itemName)) {
            toast.error('الاسم يجب أن لا يتجاوز 60 حرف');
            return;
        }

        if (itemDesc.length > 500) {
            toast.error("الوصف يجب ان لا يزيد عن 500 حرف");
            return;
        }

        if (itemFile) {
            const maxSize = 4 * 1024 * 1024; // 4MB
            if (itemFile.size > maxSize) {
                toast.error('حجم الملف لا يمكن أن يتجاوز 4MB');
                return;
            }
        }

        let compressedFile = itemFile


        if (itemFile && itemFile.size > 2 * 1024 * 1024) {
            compressedFile = await compressImage(itemFile);


        }

        setIsSavingNewItem(true)


        const itemObject = {
            menu_id: m_id,
            section_id: selectedSectionId,
            name: itemName,
            description: itemDesc,
            first_price: firstPrice

        }
        let toastMessage = "تم اضافة المنتج بنجاح"

        try {
            // Await the API call to ensure completion
            await addItemApi(itemObject, compressedFile, toastMessage);
            // Fetch the updated sections after adding the new section
            await getSections(m_id);
            // Clear the input fields
            setItemName('');
            setItemDesc('');
            setItemFile(null);
            setPreview(null)
            setFirstPrice('')
        } catch (error) {
            console.error('Error adding section:', error);
            toast.error('حدث خطأ أثناء اضافة المنتج');
        }


    }



    const addItemApi = async (itemObject, file, toastMessage) => {

        const itemPayload = file ? createFormData(itemObject, file, "image") : itemObject;



        const response = await axios.post(`${apiUrl}/api/item`, itemPayload, {
            headers: authHeader(),
        });
        console.log("Item successfully created:", response.data);
        toast.success(toastMessage);

        closeAddItemForm()
        setIsSavingNewItem(false)




    }
    async function handleUpdateSection(event) {
        event.preventDefault();
        console.log(selectedSection);
        // console.log(sectionFile);
        setIsSavingNewSection(true)

        if (!selectedSection?.name) {
            toast.error("يجب اضافة اسم للقسم")
            return; // Prevent saving if name is empty
        }

        if (selectedSection?.name.length > 60) {
            toast.error("الاسم يجب ان لا يزيد عن 60 حرف")
            return; // Prevent saving if name is empty
        }
        if (sectionFile) {
            const maxSize = 4 * 1024 * 1024; // 4MB
            if (sectionFile.size > maxSize) {
                toast.error('حجم الملف لا يمكن أن يتجاوز 4MB');
                return;
            }
        }

        let compressedFile = sectionFile


        if (sectionFile && sectionFile.size > 2 * 1024 * 1024) {
            compressedFile = await compressImage(sectionFile);


        }



        const sectionObject = {
            name: selectedSection.name,
            note: selectedSection.note,

        }

        // console.log(sectionObject);
        try {
            // Await the API call to ensure completion
            console.log(selectedSectionId);

            console.log("upd data 00 ", sectionObject, compressedFile, selectedSectionId);


            await updateSectionApi(sectionObject, compressedFile, selectedSectionId);

            // Fetch the updated sections after adding the new section
            await getSections(m_id);
            // Clear the input fields
            // setItemName('');
            // setItemDesc('');
            // setItemFile(null);
            setSectionFile(null)
            // setIsEditSectionFormVisible(null)
            toggleFormVisibility()

            setPreview(null)
            // setFirstPrice('')
        } catch (error) {
            console.error('Error update section:', error);
            setIsSavingNewSection(false)
            toast.error('حدث خطأ أثناء تعديل القسم');
        }





    }

    // const updateSectionApi = async (stateObject, file, sectionId) => {
    //     console.log(stateObject, file, sectionId);


    //     const serverPayload = file ? createFormData(stateObject, file, "cover_image") : stateObject;
    //     console.log("section updaaaaaaate before send", serverPayload);
    //     console.log("heloooooooooo", sectionId);


    //     const response = await axios.post(`${apiUrl}/api/section/update/${sectionId}`, serverPayload,
    //         {
    //             headers: authHeader(),
    //         }
    //     );
    //     console.log(response)
    //     toast.success('تم التعديل بنجاح');
    //     setIsSavingNewSection(false)

    // }

    const updateSectionApi = async (stateObject, file, sectionId) => {
        try {
            let processedFile = file;

            // Compress image if it exists

            // Rest of your existing code...
            const serverPayload = processedFile
                ? createFormData(stateObject, processedFile, "cover_image")
                : stateObject;

            const response = await axios.post(
                `${apiUrl}/api/section/update/${sectionId}`,
                serverPayload,
                {
                    headers:
                        authHeader()
                }

            );

            toast.success('تم التعديل بنجاح');
            return response.data;

        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.message || 'حدث خطأ أثناء رفع الصورة');
            throw error;
        } finally {
            setIsSavingNewSection(false);
        }
    };






    function handleItemFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result); // Store the base64 string for the image preview
            };
            reader.readAsDataURL(file);
            setItemFile(file)
        }
    }
    async function handleUpdateItemStatus(itemId, section, newStatus) {
        setIsEditItemFormVisible(false)
        console.log(itemId);
        console.log(section);


        console.log(newStatus);

        try {
            const payload = {
                is_available: newStatus,
                section_id: section
            };

            await axios.post(`${apiUrl}/api/item/update-availability/${itemId}`, payload, {
                headers: authHeader(),
            });

            // Update local state
            setSections(prevSections =>
                prevSections.map(s => ({
                    ...s,
                    items: s.items.map(i =>
                        i.id === itemId ? { ...i, is_available: newStatus } : i
                    )
                }))
            );

            toast.success(`المنتج ${newStatus ? 'نشط' : 'غير نشط'}`);
        } catch (error) {
            toast.error("Failed to update item status");
            console.error("Error:", error.response?.data || error.message);
        }
    }

    async function handleUpdateOfferStatus(itemId, newStatus) {
        setIsEditOfferFormVisible(false)

        try {
            const payload = {
                is_available: newStatus,
                section_id: selectedItem?.section_id || offerSectionId
            };

            await axios.post(`${apiUrl}/api/item/update-availability/${itemId}`, payload, {
                headers: authHeader()
            });

            // Update local state for offer items
            setOfferItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId ? { ...item, is_available: newStatus } : item
                )
            );

            toast.success(`العرض ${newStatus ? 'نشط' : 'غير نشط'}`);
        } catch (error) {
            toast.error("Failed to update offer status");
            console.error("Error:", error.response?.data || error.message);
        }
    }
    async function handleUpdateItem(event) {
        event.preventDefault();
        // console.log(selectedSection);
        // console.log(sectionFile);

        const itemId = selectedItem.id
        console.log(selectedItem.section_id);

        const nameRegex = /^.{1,60}$/;

        if (!selectedItem.name) {
            toast.error('يجب اضافة اسم للصنف');
            return;
        } else if (!nameRegex.test(selectedItem.name)) {
            toast.error('الاسم يجب أن لا يتجاوز 60 حرف');
            return;
        }

        if (selectedItem.description.length > 500) {
            toast.error("الوصف يجب ان لا يزيد عن 500 حرف");
            return;
        }

        if (itemFile) {
            const maxSize = 4 * 1024 * 1024; // 4MB
            if (itemFile.size > maxSize) {
                toast.error('حجم الملف لا يمكن أن يتجاوز 4MB');
                return;
            }
        }

        let compressedFile = itemFile


        if (itemFile && itemFile.size > 2 * 1024 * 1024) {
            compressedFile = await compressImage(itemFile);


        }

        setIsSavingNewItem(true)




        const itemObject = {
            section_id: selectedItem.section_id,
            name: selectedItem.name,
            description: selectedItem.description,

            item_price: prices.map(price => ({
                label: price.label,
                price: Number(price.price) // Convert to number if needed
            })),
            item_extras: extras.map(extra => ({
                label: extra.label || extra.name, // Handle both naming cases
                price: Number(extra.price)
            }))
        };

        console.log("item before send", itemObject);

        // console.log("item before send", itemObject);

        try {
            // Await the API call to ensure completion
            await updateItemApi(itemId, itemObject, compressedFile);
            // Fetch the updated sections after adding the new section
            await getSections(m_id);
            // Clear the input fields
            // setItemName('');
            // setItemDesc('');
            // setItemFile(null);
            // setPreview(null)
            // setFirstPrice('')
        } catch (error) {
            console.error('Error adding section:', error);
            setIsSavingNewItem(false)
            closeEditItemForm()
            toast.error('حدث خطأ أثناء تعديل المنتج');
        }






    }
    async function handleUpdateOffer(event) {
        event.preventDefault();

        setIsSavingNewItem(true)
        const offerId = selectedItem.id;

        const offerObject = {
            section_id: selectedItem.section_id,
            name: selectedItem.name,
            description: selectedItem.description,
            item_price: [{
                price: Number(selectedItem.item_prices[0].price),// أخذ السعر الأول فقط
                label: ""
            }]
            // لا نحتاج إلى extras في العرض
        };

        let compressedFile = itemFile


        if (itemFile && itemFile.size > 2 * 1024 * 1024) {
            compressedFile = await compressImage(itemFile);


        }

        setIsSavingNewItem(true)



        console.log("Offer before send", offerObject);

        try {
            await updateItemApi(offerId, offerObject, compressedFile);
            await fetchOfferItems()
            await getSections(m_id);
            closeEditOfferForm();
        } catch (error) {
            console.error('Error updating offer:', error);
            toast.error('حدث خطأ أثناء تعديل العرض');
        }
    }
    const updateItemApi = async (itemId, itemObject, file) => {


        const itemPayload2 = file ? createFormData(itemObject, file, "image") : itemObject;


        console.log("payload for item", itemPayload2);

        const response = await axios.post(`${apiUrl}/api/item/update/${itemId}`, itemPayload2, {
            headers: authHeader(),
        });
        closeEditItemForm()
        console.log("تم تعديل الصنف بنجاح", response.data);
        toast.success("تم تعديل الصنف بنجاح");
        setIsSavingNewItem(false)




    }


    // const updateItemApi = async (stateObject, file, sectionId) => {


    //     const serverPayload = file ? createFormData(stateObject, file, "cover_image") : stateObject;
    //     console.log(serverPayload);


    //     const response = await axios.post(`${apiUrl}/api/section/update/${sectionId}`, serverPayload);
    //     console.log(response)
    //     toast.success('تم التعديل بنجاح');


    // }



    const openAddItemForm = (sectionId) => {
        console.log(sectionId);
        setSelectedSectionId(sectionId)

        // setSelectedSectionId(sectionId);
        setAddItemFormVisible(true);
        closeEditSectionForm()
        closeEditOfferForm()


        setIsEditSectionFormVisible(false);
        closeEditItemForm()
        setIsEditItemFormVisible(false)
        closeAddSectionForm()
        setIsAddSectionFormVisible(false)

    };

    const openAddOfferForm = () => {
        console.log("opeendd");

        // setSelectedSectionId(sectionId);
        setAddOfferFormVisible(true);
        setAddItemFormVisible(false)
        // closeAddItemForm()
        setIsEditSectionFormVisible(false)
        closeEditSectionForm()
        setIsAddSectionFormVisible(false)
        closeAddSectionForm()
        setIsEditItemFormVisible(false)
        closeEditItemForm()

    };
    const closeAddOfferForm = () => {
        setItemFile(null)
        setAddOfferFormVisible(false)

    }

    const closeAddItemForm = () => {
        // setSelectedSectionId(null);
        setIsSavingNewItem(false)
        setItemFile(null)
        setAddItemFormVisible(false);
        setAddOfferFormVisible(false)
    };



    const handleMoreClick = (index) => {
        setActiveMoreIndex((prevIndex) => (prevIndex === index ? null : index)); // Toggle the menu for the clicked section
    };
    const handleMoreClose = () => {
        setActiveMoreIndex(null); // Close the menu when clicking outside
    };

    const handleDeleteClick = (section) => {
        setSectionToDelete(section); // Set the section to be deleted
    };

    const handleItemDeleteClick = (item) => {
        setItemToDelete(item); // Set the section to be deleted

    };


    const handleCloseDeleteModal = () => {
        setSectionToDelete(null); // Close the modal by clearing the state
        setItemToDelete(null); // Close the modal by clearing the state

    };





    const toggleCategoryMenu = (categoryId) => {
        setOpenMenu(openMenu === categoryId ? null : categoryId);
    };


    const toggleFormVisibility = (sectionId) => {
        setIsEditSectionFormVisible(!isEditSectionFormVisible);
        // setSelectedSectionId(sectionId);

    };
    const openAddSectionForm = () => {
        setIsAddSectionFormVisible(true);
        setIsEditSectionFormVisible(false);
        setIsEditItemFormVisible(false)
        setAddItemFormVisible(false)
        closeAddOfferForm()
        closeAddItemForm()
        closeEditItemForm()
        closeEditOfferForm()
        closeEditSectionForm()




    }
    const closeAddSectionForm = () => {
        setIsAddSectionFormVisible(false);
        setSectionFile(null)

    }

    const toggleAddFormVisibility = () => {
        setIsAddSectionFormVisible(!isAddSectionFormVisible);
    };
    const toggleCategoryItems = (categoryId) => {
        setExpandedCategories((prevState) => ({
            ...prevState,
            [categoryId]: !prevState[categoryId],
        }));
    };
    const deleteSectionApi = async (sectionId) => {
        try {
            console.log(sectionId);

            const response = await axios.delete(`${apiUrl}/api/section/${sectionId}`, { headers: authHeader() });
            if (response.data.success == true) {
                console.log('تم حذف القسم بنجاح');
                setSectionToDelete(null);
                toast.success("تم حذف القسم بنجاح")
                getSections(m_id)

            } else {
                console.error('Failed to delete section:', response);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };


    const duplicateCategory = (sectionId) => {
        const categoryToDuplicate = sections.find(sections => section.id === sectionId);
        const duplicatedCategory = {
            ...categoryToDuplicate,
            id: Date.now(), // Unique ID for new category
            title: `${categoryToDuplicate.title} (Copy)`,
        };
        setCategories([...categories, duplicatedCategory]);
    };



    // Delete category
    const deleteCategory = (categoryId) => {
        setCategories(categories.filter(category => category.id !== categoryId));

    };

    // Duplicate item
    const duplicateItem = (categoryId, itemId) => {
        setCategories(categories.map(category => {
            if (category.id === categoryId) {
                const itemToDuplicate = category.items.find(item => item.id === itemId);
                const duplicatedItem = {
                    ...itemToDuplicate,
                    id: Date.now(), // Unique ID for new item
                    name: `${itemToDuplicate.name} (Copy)`,
                };
                return {
                    ...category,
                    items: [...category.items, duplicatedItem],
                };
            }
            return category;
        }));
    };

    // Delete item
    const deleteItem = async (itemId) => {
        try {
            const response = await axios.delete(`${apiUrl}/api/items/${itemId}`, {
                headers: authHeader()
            });
            console.log(response);

            // if (!response.ok) {
            //     throw new Error('Failed to delete item');
            // }

            // 1. Optimistic UI Update (immediate visual feedback)
            setOfferItems(prev => prev.filter(item => item.id !== itemId));

            // 2. Show success message
            toast.success("تم الحذف بنجاح");
            setActiveItemMoreIndex(null)
            setActiveOfferMoreIndex(null)
            setItemToDelete(null)
            // 3. Refresh data from server (to ensure consistency)
            await getSections(m_id);
            const { items } = await getOfferSectionWithItems(m_id);
            setOfferItems(items);

        } catch (error) {
            console.log(error);
            toast.error("حدث خطأ أثناء الحذف");

            // 4. Revert optimistic update if error occurs
            const { items } = await getOfferSectionWithItems(m_id);
            setOfferItems(items);
        }
    };


    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const openModal = (event) => {
        event.stopPropagation();  // Prevent the event from propagating and closing modal on click
        setIsModalOpen(true);
    }; const closeModal = () => setIsModalOpen(false);

    const addSection = async (event) => {
        event.preventDefault();
        if (isUploading) return;
        const nameRegex = /^.{1,60}$/;

        if (!categoryName) {
            toast.error('يجب اضافة اسم للقسم');
            return;
        } else if (!nameRegex.test(categoryName)) {
            toast.error('الاسم يجب أن لا يتجاوز 60 حرف');
            return;
        }

        if (categoryDescription.length > 500) {
            toast.error("الوصف يجب ان لا يزيد عن 500 حرف");
            return;
        }

        if (sectionFile) {
            const maxSize = 4 * 1024 * 1024; // 4MB
            if (sectionFile.size > maxSize) {
                toast.error('حجم الملف لا يمكن أن يتجاوز 4MB');
                return;
            }
        }

        setIsSavingNewSection(true)
        let compressedFile = sectionFile


        if (sectionFile && sectionFile.size > 2 * 1024 * 1024) {
            compressedFile = await compressImage(sectionFile);


        }

        const stateObject = {
            menu_id: m_id,
            name: categoryName,
            note: categoryDescription
        };

        try {
            // Await the API call to ensure completion
            await addSectionApi(stateObject, compressedFile);
            // Fetch the updated sections after adding the new section
            await getSections(m_id);
            // Clear the input fields
            setCategoryName('');
            setCategoryDescription('');
            setSectionFile(null);
            setPreview(null)
        } catch (error) {
            console.log(error);

            console.error('Error adding section:', error);
            toast.error('حدث خطأ أثناء إضافة القسم');
            setIsSavingNewSection(false)
        }
    };



    const addSectionApi = async (stateObject, file) => {


        const serverPayload = file ? createFormData(stateObject, file, "cover_image") : stateObject;


        const response = await axios.post(`${apiUrl}/api/section`, serverPayload, {
            headers: authHeader(),
        });
        console.log("add section payloaf", serverPayload);

        console.log("add section res", response)
        toast.success('تم الأضافة بنجاح');
        setIsSavingNewSection(false)
        closeAddSectionForm()


    }




    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];

        if (!selectedFile) {
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(selectedFile.type)) {
            toast.error('نوع الملف غير مدعوم. يرجى تحميل صورة بصيغة JPEG أو PNG');
            return;
        }

        // Validate file size (4MB)
        if (selectedFile.size > 4 * 1024 * 1024) {
            toast.error('حجم الصورة يجب أن يكون أقل من 4MB');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Create preview (simulated delay for demo)
            await new Promise(resolve => {
                const interval = setInterval(() => {
                    setUploadProgress(prev => {
                        if (prev >= 90) {
                            clearInterval(interval);
                            return 90; // Hold at 90% until actual upload completes
                        }
                        return prev + 10;
                    });
                }, 100);

                createPreview(selectedFile).then(resolve);
            });

            // Store files in state
            setSectionFile(selectedFile);
            setItemFile(selectedFile);

            // Simulate final upload completion
            setUploadProgress(100);
            setTimeout(() => setIsUploading(false), 500); // Brief delay to show 100%

            toast.success('تم تحميل الصورة بنجاح');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('فشل تحميل الصورة');
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const createPreview = (file) => {
        return new Promise((resolve) => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setPreview(reader.result);
                resolve();
            };
        });
    };



    // const handleFileChange = (event) => {
    //     const selectedFile = event.target.files[0];

    //     if (!selectedFile) {
    //         return;
    //     }

    //     if (selectedFile.size > 4 * 1024 * 1024) {
    //         toast.error('حجم الصورة يجب أن يكون أقل من 4MB');
    //         return;
    //     }



    //     setSectionFile(selectedFile); // Storing file in state
    //     setItemFile(selectedFile); // Storing file in state

    //     console.log(selectedFile);

    //     createPreview(selectedFile); // Update the preview

    // };

    // const createPreview = (file) => {
    //     if (preview) {
    //         URL.revokeObjectURL(preview);
    //     }

    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onloadend = () => setPreview(reader.result);
    // };
    const handlePreviewClick = (event) => {
        event.stopPropagation(); // Stop the click from triggering file input
    };
    const handleDeleteImg = (event) => {
        event.stopPropagation(); // Stop event propagation to prevent file input from being triggered
        setPreview(null); // Clear the preview
        setSectionFile(null); // Clear the preview

    };

    const sectionTab = (sectionName) =>
        `cursor-pointer py-2 px-2   md:text-xl text-[1rem] cairo font-[650] ${activeSectionEditor === sectionName
            ? "border-b-2  border-[#20617c]"
            : "text-[#20617c] "
        } `;
    const itemTab = (sectionName) =>
        `cursor-pointer py-2 px-2   md:text-xl text-[1rem] cairo font-[650] ${activeItemEditor === sectionName
            ? "border-b-2  border-[#20617c]"
            : "text-[#20617c] "
        } `;

    const addPhone = () => {
        setPhones([...phones, ""]); // Add new empty input field
    };
    const deletePhone = (index) => {
        if (phones.length === 1) {
            setPhones([""]); // Keep at least one input field
            return;
        }
        const updatedPhones = phones.filter((_, i) => i !== index);
        setPhones(updatedPhones);
    };
    const handlePhoneChange = (index, value) => {
        const updatedPhones = [...phones];
        updatedPhones[index] = value;
        setPhones(updatedPhones);
    };



    const savePhones = async () => {
        try {
            const response = await axios.post(`${apiUrl}/api/contacts`, {
                menu_id: m_id,
                phones, // Sending all phone numbers
            }, {
                headers: authHeader(),
            });



            toast.success("Phone numbers saved successfully!")
        } catch (error) {
            console.error("Error saving phone numbers:", error);
        }
    };


    const addPrice = (e) => {
        e.preventDefault()
        setSelectedItem(prev => ({
            ...prev,
            item_prices: [...prev.item_prices, { label: '', price: '' }]
        }));
    };

    const deletePrice = (index) => {
        setSelectedItem(prev => ({
            ...prev,
            item_prices: prev.item_prices.filter((_, i) => i !== index)
        }));
    };

    const handlePriceChange = (index, field, value) => {
        setSelectedItem(prev => {
            const newPrices = [...prev.item_prices];
            newPrices[index] = { ...newPrices[index], [field]: value };
            return { ...prev, item_prices: newPrices };
        });
    };



    const addExtra = () => {
        setExtras(prev => [...prev, { name: '', price: '' }]);
    };

    const deleteExtra = (index) => {
        setExtras(prev => prev.filter((_, i) => i !== index));
    };

    const handleExtraChange = (index, field, value) => {
        setExtras(prev => {
            const newExtras = [...prev];
            newExtras[index] = { ...newExtras[index], [field]: value };
            return newExtras;
        });
    };



    // const addPrice = (e) => {
    //     e.preventDefault()
    //     setPrices([...prices, { label: "", price: "" }]);
    // };

    // const addExtra = () => {
    //     setExtras([...extras, { label: "", price: "" }]);
    // };
    // // const deletePrice = (index) => {
    // //     const updatedPrices = prices.filter((_, i) => i !== index);
    // //     setPrices(updatedPrices);
    // // };

    // const deleteExtra = (index) => {
    //     const updatedExtras = extras.filter((_, i) => i !== index);
    //     setExtras(updatedExtras);
    // };


    return <>

        {isMenuLoading ? (<>
            <div className="menu-loading min-h-screen animate-pulse flex justify-center items-center  bg-slate-50/75">
                <div className="text-center">
                    <div
                        className="w-32 h-32 border-4 flex p-2 justify-center items-center border-dashed rounded-full animate-spin border-red-500 mx-auto"
                    >

                        <img src={eats} alt="" />


                    </div>

                </div>



            </div>

        </>

        ) : scratchMenu || sections.length > 0 ? (<div dir='rtl' onClick={() => {
            handleMoreClose();
            closeMoreClick()
        }} className="menu-management min-h-screen relative cairo pb-20 flex flex-col items-center">
            <Toaster></Toaster>
            <div className={`edit-section-form  fixed p-3 rounded-s-lg z-20 md:top-36 left-0 bottom-0 lg:w-1/3 md:w-1/2 w-full top-0   bg-white shadow-xl border-2 transition-all duration-500 ease-in-out 
                ${isEditSectionFormVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}
            >
                <div className="section-name  p-3 flex gap-2 items-center">
                    <i onClick={closeEditSectionForm} className="close-form cursor-pointer  fa-solid fa-x cairo text-gray-500"></i> <p className='font-medium cairo'>تعديل القسم</p>
                </div>
                <hr className='w-full ' />
                <div className="edit-section px-2 mt-4">
                    <div className="category-name">
                        <p className='text-sm cairo'> اسم الصنف <span><i className="fa-solid fa-asterisk text-red-500 text-sm"></i></span></p>
                        <input className='w-full text-sm p-1 mt-2 rounded-md border-2 h-9' type="text" placeholder="Category name" value={selectedSection?.name || ''} // Use selectedSection's name
                            onChange={(e) =>
                                setSelectedSection((prev) => ({ ...prev, name: e.target.value }))
                            }
                        />

                    </div>
                    <div className="category-description mt-4">
                        <p className='text-sm cairo'> الوصف</p>
                        <textarea
                            rows="3"
                            style={{ resize: "none" }}
                            className="w-full text-sm mt-3 p-3 border rounded-md"
                            placeholder="صف القسم  ..."
                            value={selectedSection?.note || ''} // Use selectedSection's description
                            onChange={(e) =>
                                setSelectedSection((prev) => ({ ...prev, note: e.target.value }))
                            }
                        ></textarea>

                    </div>
                    <div className="category-image">
                        <p className='text-sm cairo'>الصورة</p>
                        <label htmlFor="section-image-upload" className="cursor-pointer">
                            <div className="img border hover:border-dashed hover:border-blue-700 mt-2 w-44 h-44 flex flex-col justify-center items-center px-6 rounded-md bg-slate-100 relative">
                                {selectedSection?.cover_image_url || sectionFile ? (
                                    <>
                                        <img
                                            src={sectionFile ? URL.createObjectURL(sectionFile) : selectedSection.cover_image_url}
                                            alt="Selected"
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
                                            <i className="fa-solid fa-arrow-up-from-bracket text-2xl text-white"></i>
                                            <p className="text-white mt-8">Change Image</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-arrow-up-from-bracket text-2xl text-blue-500"></i>
                                        <p className="mt-3">تجميل</p>
                                        <p className="text-sm text-gray-500">Only jpg, jpeg, png files are supported</p>
                                    </>
                                )}
                            </div>
                        </label>
                        <input
                            id="section-image-upload"
                            type="file"
                            accept="image/jpeg, image/png, image/jpg"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                </div>
                <div className="edit-action flex justify-end items-center px-6 gap-3 absolute border shadow-lg bottom-0 left-0 right-0 h-14 bg-white">
                    <button onClick={toggleFormVisibility} className=' close-form py-2 px-4 bg-gray-200 rounded-md'>تراجع </button>

                    <button
                        onClick={handleUpdateSection} className={`py-2 px-6 rounded-md text-white ${isUploading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} transition-colors flex items-center`}
                        disabled={isUploading}
                    >
                        {isSavingNewSection ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                جاري الحفظ...
                            </>
                        ) : 'حفظ'}
                    </button>


                </div>

            </div>
            {isModalOpen && (
                <div
                    className="modal fixed inset-0 z-30 bg-black/50 flex justify-center items-center"
                    onClick={closeModal} // Close modal when clicking outside
                >
                    <button
                        onClick={closeModal}
                        className="absolute top-14 right-14 text-white text-4xl p-2 rounded-full"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <div
                        className="modal-content relative w-1/4  p-4 rounded-md"
                        onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside the modal
                    >
                        <img
                            src={preview || ''}
                            alt="Large View"
                            className="w-full max-w-3xl max-h-screen object-contain"
                        />

                    </div>
                </div>
            )}

            <div className={`add-section-form fixed  p-3 rounded-s-lg md:z-20 z-30 md:top-36 left-0 bottom-0 lg:w-1/3 md:w-1/2 w-full top-0   bg-white  shadow-xl border-2 transition-all duration-500 ease-in-out ${isAddSectionFormVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'} `} >
                <div className="section-name  p-3 flex gap-2 items-center">
                    <i onClick={closeAddSectionForm} className="close-form cursor-pointer  fa-solid fa-x text-gray-500"></i> <p className='font-medium'>اضف قسم جديد</p>
                </div>
                <hr className='w-full ' />
                {/* <form onSubmit={addSection}>
                    <div className="edit-section px-2 mt-4">
                        <div className="category-name">
                            <p className='text-sm'><span><i className="fa-solid fa-asterisk text-red-500 text-sm"></i></span> الأسم</p>
                            <input className='w-full text-sm p-1 mt-2 rounded-md border-2 h-9' type="text" placeholder="اسم القسم" name="category-name" id="category-name" value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}  // Update category name state
                            />

                        </div>
                        <div className="category-description mt-4">
                            <p className='text-sm'> الوصف</p>
                            <textarea
                                rows="3"
                                style={{ resize: "none" }}
                                className="w-full text-sm mt-3 p-3 border rounded-md"
                                placeholder="اعطي نبذة عن القسم ..." value={categoryDescription}
                                onChange={(e) => setCategoryDescription(e.target.value)}  // Update category name state

                            ></textarea>

                        </div>

                        <input
                            style={{ display: 'none' }}
                            id={`file-upload`}
                            type="file"
                            onChange={handleFileChange}
                            accept="image/jpeg, image/png"

                        />
                        <label htmlFor={isHovered ? 'forNoClick' : `file-upload`}>
                            <div className="category-image">
                                {preview ?
                                    <div className="img border hover:border-dashed hover:border-blue-700 mt-2 w-44 h-56 flex flex-col  items-center  rounded-md bg-slate-100">
                                        <div onMouseEnter={handleMouseEnter}
                                            onMouseLeave={handleMouseLeave} className="img-preview relative">
                                            {isHovered && (
                                                <div onClick={openModal} className="preview cursor-pointer absolute inset-0 flex justify-center items-center bg-black/30 text-white">
                                                    <i className="fa-regular fa-eye"></i> preview
                                                </div>
                                            )}
                                            <img
                                                src={preview || ''}
                                                alt={'asdadsasd'}
                                                className='w-full h-44 rounded-md'
                                            />

                                        </div>

                                        <hr />
                                        <div onClick={handleDeleteImg} className="delete w-full h-full hover:bg-slate-200 cursor-pointer flex justify-center items-center">
                                            <i className="text-gray-500  fa-solid fa-trash-can"></i>
                                        </div>
                                    </div>

                                    :
                                    <>
                                        <div className="add-img cursor-pointer">
                                            <p className='text-sm'> الصورة</p>
                                            <div className="img border hover:border-dashed hover:border-blue-700 mt-2 w-44 h-44 flex flex-col justify-center items-center px-6 rounded-md bg-slate-100">
                                                <i className="fa-solid fa-arrow-up-from-bracket text-2xl text-blue-500"></i>
                                                <p className='mt-3'>تحميل</p>
                                                <p className='text-sm text-gray-600'>يدعم فقط</p>

                                                <p className='text-sm text-gray-500'>  jpg, jpeg, png </p>
                                            </div>


                                        </div>



                                    </>}

                            </div>

                        </label>

                    </div>
                    <div className="edit-action flex justify-end items-center px-6 gap-3 absolute border shadow-lg bottom-0 left-0 right-0 h-14 bg-white">
                        <button onClick={toggleAddFormVisibility} className=' close-form py-2 px-4 bg-gray-200 rounded-md'>تراجع </button>
                        <button type='submit' className='py-2 px-6 rounded-md text-white bg-green-600'>حفظ</button>



                    </div>
                </form> */}
                <form onSubmit={addSection} className=" pb-14">
                    <div className="edit-section px-2 mt-4">
                        {/* Category Name Field */}
                        <div className="category-name">
                            <p className='text-sm'>
                                <span className="text-red-500 mr-1">*</span>
                                الأسم
                            </p>
                            <input
                                className='w-full text-sm p-1 mt-2 rounded-md border-2 h-9'
                                type="text"
                                placeholder="اسم القسم"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                required
                            />
                        </div>

                        {/* Category Description Field */}
                        <div className="category-description mt-4">
                            <p className='text-sm'>الوصف</p>
                            <textarea
                                rows="3"
                                style={{ resize: "none" }}
                                className="w-full text-sm mt-3 p-3 border rounded-md"
                                placeholder="اعطي نبذة عن القسم ..."
                                value={categoryDescription}
                                onChange={(e) => setCategoryDescription(e.target.value)}
                            ></textarea>
                        </div>

                        {/* Image Upload Section */}
                        <div className="mt-4">
                            <input
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                id="file-upload"
                                type="file"
                                onChange={handleFileChange}
                                accept="image/jpeg, image/png"
                                disabled={isUploading}
                            />

                            <label htmlFor={isUploading ? 'forNoClick' : 'file-upload'}>
                                <div className="category-image">
                                    {isUploading ? (
                                        // Upload Progress UI
                                        <div className="upload-progress-container w-44 h-56 flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-md bg-blue-50">
                                            <div className="w-3/4 mb-4">
                                                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
                                                        style={{ width: `${uploadProgress}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-center text-xs mt-1 text-blue-600">
                                                    جاري التحميل... {uploadProgress}%
                                                </p>
                                            </div>
                                            <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                    ) : preview ? (
                                        // Image Preview UI
                                        <div className="img-container border hover:border-dashed hover:border-blue-700 mt-2 w-44 h-56 flex flex-col items-center rounded-md bg-slate-100 overflow-hidden">
                                            <div
                                                className="relative w-full h-44"
                                                onMouseEnter={() => setIsHovered(true)}
                                                onMouseLeave={() => setIsHovered(false)}
                                            >
                                                {isHovered && (
                                                    <div className="preview-overlay absolute inset-0 flex justify-center items-center bg-black/30 text-white cursor-pointer">
                                                        <i className="fa-regular fa-eye mr-2"></i>
                                                        <span>معاينة</span>
                                                    </div>
                                                )}
                                                <img
                                                    src={preview}
                                                    alt="معاينة الصورة"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div
                                                className="delete-btn w-full py-2 hover:bg-slate-200 cursor-pointer flex justify-center items-center"
                                                onClick={handleDeleteImg}
                                            >
                                                <i className="text-gray-500 fa-solid fa-trash-can mr-2"></i>
                                                <span className="text-sm">حذف</span>
                                            </div>
                                        </div>
                                    ) : (
                                        // Default Upload UI
                                        <div className="upload-prompt cursor-pointer">
                                            <p className='text-sm'>الصورة</p>
                                            <div className="upload-box border hover:border-dashed hover:border-blue-700 mt-2 w-44 h-44 flex flex-col justify-center items-center px-6 rounded-md bg-slate-100">
                                                <i className="fa-solid fa-arrow-up-from-bracket text-2xl text-blue-500 mb-2"></i>
                                                <p className='mt-1 text-sm'>تحميل الصورة</p>
                                                <p className='text-xs text-gray-600 mt-2'>يدعم فقط: JPG, PNG</p>
                                                <p className='text-xs text-gray-500 mt-1'>الحد الأقصى: 3MB</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions flex justify-end items-center  px-6 gap-3 absolute border-t shadow-lg bottom-0 left-0 right-0 h-14 ">
                        <button onClick={closeAddSectionForm}
                            type="button"
                            className='py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors'
                            disabled={isUploading}
                        >
                            تراجع
                        </button>
                        <button
                            type="submit"
                            className={`py-2 px-6 rounded-md text-white ${isUploading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} transition-colors flex items-center`}
                            disabled={isUploading}
                        >
                            {isSavingNewSection ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    جاري الحفظ...
                                </>
                            ) : 'حفظ'}
                        </button>
                    </div>
                </form>

            </div>
            {

                isEditItemFormVisible && (
                    <div className={`edit-item-form fixed  p-3 rounded-s-lg md:z-20 z-30 md:top-36 left-0 bottom-0 lg:w-1/3 md:w-1/2 w-full top-0 bg-white shadow-xl border-2 transition-all duration-500 ease-in-out `} >
                        <div className="item-name  p-3 flex gap-2 items-center">
                            <i onClick={closeEditItemForm} className="close-form cursor-pointer  fa-solid fa-x text-gray-500"></i> <p className='font-medium'> تعديل الصنف</p>
                        </div>
                        <hr className='w-full ' />

                        <div className="overflow-y-scroll h-5/6">
                            <form onSubmit={handleUpdateItem} >


                                <div className="flex bg-white mb-4 border-b border-gray-200 pt-2  ">
                                    <div
                                        className={itemTab("details")}
                                        onClick={() => setActiveItemEditor("details")}
                                    >
                                        تفاصيل
                                    </div>



                                </div>
                                {activeItemEditor === "details" && (
                                    <div>

                                        <div className="item-name mt-4">
                                            <label htmlFor="edit_item_name" className="block">
                                                <span className="text-red-500">*</span> الأسم
                                            </label>
                                            <input
                                                type="text"
                                                name="name"

                                                className="w-full text-sm p-1 mt-2 rounded-md border-2 h-9"
                                                placeholder="Item name"
                                                value={selectedItem?.name || ""}
                                                onChange={(e) =>
                                                    setSelectedItem((prev) => ({ ...prev, name: e.target.value }))
                                                }

                                                required
                                            />
                                        </div>

                                        <div className="category-description mt-4">
                                            <p className="text-sm">الوصف</p>
                                            <textarea
                                                rows="3"
                                                name="description"
                                                style={{ resize: "none" }}
                                                className="w-full text-sm mt-3 p-3 border rounded-md"
                                                placeholder="قم بوصف الصنف الخاص بك ..."
                                                value={selectedItem?.description || ""}
                                                onChange={(e) =>
                                                    setSelectedItem((prev) => ({ ...prev, description: e.target.value }))
                                                }

                                            ></textarea>
                                        </div>
                                        <div className="item-image w-1/2">
                                            <p className='text-sm'>الصورة</p>
                                            <label htmlFor="section-image-upload" className="cursor-pointer">
                                                <div className="img border hover:border-dashed hover:border-blue-700 mt-2 w-44 h-44 flex flex-col justify-center items-center px-6 rounded-md bg-slate-100 relative">
                                                    {selectedItem?.image || itemFile ? (
                                                        <>
                                                            <img
                                                                src={itemFile ? URL.createObjectURL(itemFile) : selectedItem.image_url}
                                                                alt="Selected"
                                                                className="w-full h-full object-cover rounded-md"
                                                            />
                                                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
                                                                <i className="fa-solid fa-arrow-up-from-bracket text-2xl text-white"></i>
                                                                <p className="text-white mt-8">تعديل الصورة</p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fa-solid fa-arrow-up-from-bracket text-2xl text-blue-500"></i>
                                                            <p className="mt-3">تحميل</p>
                                                            <p className="text-sm text-gray-500">Only jpg, jpeg, png files are supported</p>
                                                        </>
                                                    )}
                                                </div>
                                            </label>
                                            <input
                                                id="section-image-upload"
                                                type="file"
                                                accept="image/jpeg, image/png, image/jpg"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </div>

                                        {/* <div className="item-first-price my-4 " >
                                            <label className="block mb-3" htmlFor="">
                                                Price
                                            </label>
                                            <input
                                                className="rounded-md w-44 h-9 border-2 px-2"
                                                placeholder="0,00"
                                                type="text"
                                                value={selectedItem.item_prices[0]?.price}


                                            />
                                        </div> */}


                                        <div className="prices-labels mt-5">
                                            <p className="text-[#1b5067] text-lg font-medium">الأسعار</p>
                                            <div className="price-instructions mb-4">
                                                <p className="text-xs leading-5 text-gray-500">
                                                    الاصناف يمكن ان يكون لديها لها اكثر من سعر بناءاّ علي الاحجام
                                                </p>
                                            </div>

                                            <div className="add-new-price-btn">
                                                {selectedItem.item_prices && selectedItem.item_prices.length > 0 ? (
                                                    [...selectedItem.item_prices].sort((a, b) => new Date(a.id) - new Date(b.id))
                                                        .map((price, index) => (
                                                            <div className="new-price flex gap-4 items-end mb-4" key={index}>
                                                                <div className="add-price-name">
                                                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                                                        الأسم
                                                                    </label>
                                                                    <input
                                                                        className="rounded-md w-44 h-9 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        placeholder=" حجم صغير"
                                                                        type="text"
                                                                        value={price.label || ''}
                                                                        onChange={(e) => handlePriceChange(index, 'label', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="add-price-price">
                                                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                                                        السعر
                                                                    </label>
                                                                    <input
                                                                        className="rounded-md w-44 h-9 border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        placeholder="0.00"
                                                                        type="text"
                                                                        // step="0.01"
                                                                        // min="0"
                                                                        value={price.price.toString() || ''}
                                                                        onChange={(e) => handlePriceChange(index, 'price', e.target.value)}
                                                                    />
                                                                </div>
                                                                <button
                                                                    className="h-9 w-9 flex items-center justify-center text-gray-600 hover:text-red-600"
                                                                    onClick={() => deletePrice(index)}
                                                                    title="Delete price"
                                                                >
                                                                    <i className="fa-solid fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        ))
                                                ) : (
                                                    <p className="text-gray-500 text-sm mb-4">لا يوجد اسعار من قبل</p>
                                                )}

                                                <button
                                                    className="flex gap-2 items-center text-[#2a7696] hover:text-[#1b5067] mt-2"
                                                    onClick={addPrice}
                                                >
                                                    <i className="fa-solid fa-plus"></i>
                                                    اضف سعر جديد
                                                </button>
                                            </div>
                                        </div>

                                        <hr className="mt-2" />

                                        <div className="extras-labels mt-5">
                                            <p className="text-[#1b5067] text-lg font-medium">الأضافات</p>
                                            <div className="extra-instructions mb-4">
                                                <p className="text-xs leading-5 text-gray-500">
                                                    كل الأصناف يمكن ان يكون لديها اضافات خاصة
                                                </p>
                                            </div>

                                            <div className="add-new-extra-btn">
                                                {extras && extras.length > 0 ? (
                                                    [...extras].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map((extra, index) => (
                                                        <div className="new-extra flex gap-4 items-end mb-4" key={index}>
                                                            <div className="add-extra-name">
                                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                                    الأسم
                                                                </label>
                                                                <input
                                                                    className="rounded-md w-44 h-9 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    placeholder="اضافة جبنة"
                                                                    type="text"
                                                                    value={extra.label || ''}
                                                                    onChange={(e) => handleExtraChange(index, 'label', e.target.value)}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="add-extra-price">
                                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                                    السعر
                                                                </label>
                                                                <input
                                                                    className="rounded-md w-44 h-9 border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    placeholder="0.00"
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0"
                                                                    value={extra.price || ''}
                                                                    onChange={(e) => handleExtraChange(index, 'price', e.target.value)}
                                                                    required
                                                                />
                                                            </div>
                                                            <button
                                                                className="h-9 w-9 flex items-center justify-center text-gray-600 hover:text-red-600"
                                                                onClick={() => deleteExtra(index)}
                                                                title="Delete extra"
                                                            >
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 text-sm mb-4">لا يوجد اضافات من قبل</p>
                                                )}

                                                <div className="flex justify-between mt-6">
                                                    <button
                                                        className="flex gap-2 items-center text-[#2a7696] hover:text-[#1b5067]"
                                                        onClick={addExtra}
                                                    >
                                                        <i className="fa-solid fa-plus"></i>
                                                        اضف اضافة خاصة
                                                    </button>
                                                </div>
                                            </div>
                                        </div>




                                    </div>

                                )}


                                <div className="edit-action flex justify-end items-center px-6 gap-3 absolute border shadow-lg bottom-0 left-0 right-0 h-14 bg-white">
                                    <button onClick={closeEditItemForm} type="button" className="close-form py-2 px-4 bg-gray-200 rounded-md">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={`py-2 px-6 rounded-md text-white ${isUploading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} transition-colors flex items-center`}
                                        disabled={isUploading}
                                    >
                                        {isSavingNewItem ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                جاري الحفظ...
                                            </>
                                        ) : 'حفظ'}
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                )
            }
            {

                isEditOfferFormVisible && (
                    <div className={`edit-offer-form fixed p-3 rounded-s-lg md:z-20 z-30 md:top-36 left-0 bottom-0 lg:w-1/3 md:w-1/2 w-full top-0 bg-white shadow-xl border-2 transition-all duration-500 ease-in-out`}>
                        <div className="item-name p-3 flex gap-2 items-center">
                            <i onClick={closeEditOfferForm} className="close-form cursor-pointer fa-solid fa-x text-gray-500"></i>
                            <p className='font-medium'>تعديل العرض</p>
                        </div>
                        <hr className='w-full' />

                        <div className="overflow-y-scroll h-5/6">
                            <form onSubmit={handleUpdateOffer}>
                                <div className="flex bg-white mb-4 border-b border-gray-200 pt-2">
                                    <div className={itemTab("details")} onClick={() => setActiveItemEditor("details")}>
                                        Details
                                    </div>
                                </div>

                                {activeItemEditor === "details" && (
                                    <div>
                                        <div className="item-name mt-4">
                                            <label htmlFor="edit_item_name" className="block">
                                                <span className="text-red-500">*</span> Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                className="w-full text-sm p-1 mt-2 rounded-md border-2 h-9"
                                                placeholder="Offer name"
                                                value={selectedItem?.name || ""}
                                                onChange={(e) => setSelectedItem((prev) => ({ ...prev, name: e.target.value }))}
                                                required
                                            />
                                        </div>

                                        <div className="category-description mt-4">
                                            <p className="text-sm">Description</p>
                                            <textarea
                                                rows="3"
                                                name="description"
                                                style={{ resize: "none" }}
                                                className="w-full text-sm mt-3 p-3 border rounded-md"
                                                placeholder="Describe your offer ..."
                                                value={selectedItem?.description || ""}
                                                onChange={(e) => setSelectedItem((prev) => ({ ...prev, description: e.target.value }))}
                                            ></textarea>
                                        </div>

                                        {/* <div className="item-image">
                                            <p className='text-sm'>Image</p>
                                            <label htmlFor="section-image-upload" className="cursor-pointer">
                                                <div className="img border hover:border-dashed hover:border-blue-700 mt-2 w-44 h-44 flex flex-col justify-center items-center px-6 rounded-md bg-slate-100 relative">
                                                    {selectedItem?.image || itemFile ? (
                                                        <>
                                                            <img
                                                                src={selectedItem.image_url ? selectedItem.image_url : URL.createObjectURL(itemFile)}
                                                                alt="Selected"
                                                                className="w-full h-full object-cover rounded-md"
                                                            />
                                                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
                                                                <i className="fa-solid fa-arrow-up-from-bracket text-2xl text-white"></i>
                                                                <p className="text-white mt-8">Change Image</p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fa-solid fa-arrow-up-from-bracket text-2xl text-blue-500"></i>
                                                            <p className="mt-3">Upload</p>
                                                            <p className="text-sm text-gray-500">Only jpg, jpeg, png files are supported</p>
                                                        </>
                                                    )}
                                                </div>
                                            </label>
                                            <input
                                                id="section-image-upload"
                                                type="file"
                                                accept="image/jpeg, image/png, image/jpg"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </div> */}

                                        <div className="item-image w-1/2">
                                            <p className='text-sm'>الصورة</p>
                                            <label htmlFor="section-image-upload" className="cursor-pointer">
                                                <div className="img border hover:border-dashed hover:border-blue-700 mt-2 w-44 h-44 flex flex-col justify-center items-center px-6 rounded-md bg-slate-100 relative">
                                                    {selectedItem?.image || itemFile ? (
                                                        <>
                                                            <img
                                                                src={itemFile ? URL.createObjectURL(itemFile) : selectedItem.image_url}
                                                                alt="Selected"
                                                                className="w-full h-full object-cover rounded-md"
                                                            />
                                                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
                                                                <i className="fa-solid fa-arrow-up-from-bracket text-2xl text-white"></i>
                                                                <p className="text-white mt-8">تعديل الصورة</p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fa-solid fa-arrow-up-from-bracket text-2xl text-blue-500"></i>
                                                            <p className="mt-3">تحميل</p>
                                                            <p className="text-sm text-gray-500">Only jpg, jpeg, png files are supported</p>
                                                        </>
                                                    )}
                                                </div>
                                            </label>
                                            <input
                                                id="section-image-upload"
                                                type="file"
                                                accept="image/jpeg, image/png, image/jpg"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                        {/* عرض سعر العرض الوحيد */}
                                        <div className="prices-labels mt-5">
                                            <p className="text-[#1b5067] text-lg font-medium">Price</p>

                                            <div className="new-price flex gap-4 items-end mb-4">
                                                <div className="add-price-price w-full">
                                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                                        Price
                                                    </label>
                                                    <input
                                                        className="rounded-md w-full h-9 border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="0.00"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={selectedItem?.item_prices?.[0]?.price || ''}
                                                        onChange={(e) => {
                                                            // تحديث سعر العرض الأول مباشرة
                                                            setSelectedItem(prev => ({
                                                                ...prev,
                                                                item_prices: [{
                                                                    ...prev.item_prices[0],
                                                                    price: e.target.value
                                                                }]
                                                            }));
                                                        }}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="edit-action flex justify-end items-center px-6 gap-3 absolute border shadow-lg bottom-0 left-0 right-0 h-14 bg-white">
                                    <button onClick={closeEditOfferForm} type="button" className="close-form py-2 px-4 bg-gray-200 rounded-md">
                                        تراجع
                                    </button>
                                    <button
                                        type="submit"
                                        className={`py-2 cairo px-6 rounded-md text-white ${isUploading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} transition-colors flex items-center justify-center`}
                                        disabled={isUploading}
                                    >
                                        {isSavingNewItem ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                جاري الحفظ...
                                            </>
                                        ) : 'حفظ'}
                                    </button>                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {isAddItemFormVisible && (

                <div className={`add-item-form fixed p-3 rounded-s-lg md:z-20 z-30 md:top-36 left-0 bottom-0 lg:w-1/3 md:w-1/2 w-full top-0 bg-white shadow-xl border-2 transition-all duration-500 ease-in-out ${isAddItemFormVisible
                    ? "opacity-100 translate-x-0 pointer-events-auto"
                    : "opacity-0 translate-x-full pointer-events-none"
                    }`} >
                    <div className="item-name  p-3 flex gap-2 items-center">
                        <i onClick={closeAddItemForm} className="close-form cursor-pointer  fa-solid fa-x text-gray-500"></i> <p className='font-medium cairo'>اضافة صنف جديد</p>
                    </div>
                    <hr className='w-full ' />

                    <div className="overflow-y-scroll h-5/6">
                        <form onSubmit={handleAddItemSubmit}>
                            <input type="hidden" name="section_id" value={selectedSectionId} />

                            <div className="flex bg-white mb-4 border-b border-gray-200 pt-2">
                                <div
                                    className={itemTab("details")}
                                    onClick={() => setActiveItemEditor("details")}
                                >
                                    تفاصيل
                                </div>
                            </div>

                            {activeItemEditor === "details" && (
                                <div>
                                    {/* Item Name */}
                                    <div className="item-name mt-4">
                                        <label htmlFor="item_name" className="block cairo">
                                            اسم الصنف <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="item_name"
                                            value={itemName}
                                            onChange={(e) => setItemName(e.target.value)}
                                            className="w-full cairo text-sm p-1 mt-2 rounded-md border-2 h-9"
                                            placeholder="مكرونة"
                                            required
                                            disabled={isUploading}
                                        />
                                    </div>

                                    {/* Item Description */}
                                    <div className="item-description mt-4">
                                        <p className="text-sm cairo">الوصف</p>
                                        <textarea
                                            rows="3"
                                            name="description"
                                            value={itemDesc}
                                            style={{ resize: "none" }}
                                            className="w-full cairo text-sm mt-3 p-3 border rounded-md"
                                            placeholder="اضف وصف لمنتجك ..."
                                            onChange={(e) => setItemDesc(e.target.value)}
                                            disabled={isUploading}
                                        ></textarea>
                                    </div>

                                    {/* Item Image Upload */}
                                    <div className="item-image mt-4">
                                        <p className="text-sm cairo">الصورة</p>
                                        <input
                                            type="file"
                                            name="item_image"
                                            accept="image/jpeg, image/png"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="item_image_upload"
                                            disabled={isUploading}
                                        />

                                        <label htmlFor={isUploading ? 'forNoClick' : 'item_image_upload'}>
                                            <div className="relative">
                                                {isUploading ? (
                                                    <div className="upload-progress-container w-44 h-44 flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-md bg-blue-50">
                                                        <div className="w-3/4 mb-3">
                                                            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
                                                                    style={{ width: `${uploadProgress}%` }}
                                                                ></div>
                                                            </div>
                                                            <p className="text-center text-xs mt-1 text-blue-600">
                                                                جاري التحميل... {uploadProgress}%
                                                            </p>
                                                        </div>
                                                        <svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    </div>
                                                ) : preview ? (
                                                    <div className="img-container border hover:border-dashed hover:border-blue-700 mt-2 w-44 h-44 rounded-md bg-slate-100 overflow-hidden relative">
                                                        <img
                                                            src={preview}
                                                            alt="معاينة الصورة"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={handleDeleteImg}
                                                            className="absolute bottom-0 left-0 right-0 py-1 bg-white/90 hover:bg-gray-100 text-gray-700 text-sm flex justify-center items-center"
                                                        >
                                                            <i className="fas fa-trash-alt ml-1"></i>
                                                            حذف الصورة
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="img border hover:border-dashed hover:border-blue-700 mt-2 w-44 h-44 flex flex-col justify-center items-center px-6 rounded-md bg-slate-100 cursor-pointer">
                                                        <i className="fa-solid fa-arrow-up-from-bracket text-2xl text-blue-500"></i>
                                                        <p className="mt-3 cairo">تحميل</p>
                                                        <p className="text-xs text-gray-500 cairo">jpg, jpeg, png</p>
                                                        <p className="text-xs text-gray-400 cairo">(حد أقصى 4MB)</p>
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    </div>

                                    {/* Item Price */}
                                    <div className="item-first-price my-4">
                                        <label className="block cairo mb-3" htmlFor="">
                                            السعر
                                        </label>
                                        <input
                                            className="rounded-md w-44 h-9 cairo border-2 px-2"
                                            placeholder="0,00"
                                            type="text"
                                            value={firstPrice}
                                            onChange={(e) => setFirstPrice(e.target.value)}
                                            disabled={isUploading}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Submit Buttons */}
                            <div className="edit-action flex justify-end items-center px-6 gap-3 absolute border shadow-lg bottom-0 left-0 right-0 h-14 bg-white">
                                <button
                                    type="button"
                                    onClick={closeAddItemForm}
                                    className="close-form cairo py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                    disabled={isUploading}
                                >
                                    الغاء
                                </button>
                                <button
                                    type="submit"
                                    className={`py-2 cairo px-6 rounded-md text-white ${isUploading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} transition-colors flex items-center justify-center`}
                                    disabled={isUploading}
                                >
                                    {isSavingNewItem ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            جاري الحفظ...
                                        </>
                                    ) : 'حفظ'}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
            {isAddOfferFormVisible && (
                <div className={`add-offer-form fixed p-3 rounded-s-lg md:z-20 z-30 md:top-36 left-0 bottom-0 lg:w-1/3 md:w-1/2 w-full top-0 bg-white shadow-xl border-2 transition-all duration-500 ease-in-out ${isAddOfferFormVisible
                    ? "opacity-100 translate-x-0 pointer-events-auto"
                    : "opacity-0 translate-x-full pointer-events-none"
                    }`} >
                    <div className="offer-name  p-3 flex gap-2 items-center">
                        <i onClick={closeAddOfferForm} className="close-form cursor-pointer  fa-solid fa-x text-gray-500"></i> <p className='font-medium cairo'>اضافة عرض جديد</p>
                    </div>
                    <hr className='w-full ' />

                    <div className="overflow-y-scroll h-5/6">
                        <form onSubmit={handleAddOfferSubmit}>
                            {/* <input type="hidden" name="section_id" value={selectedSectionId} /> */}

                            <div className="flex bg-white mb-4 border-b border-gray-200 pt-2  ">
                                <div
                                    className={itemTab("details")}
                                    onClick={() => setActiveItemEditor("details")}
                                >
                                    تفاصيل
                                </div>


                                {/* <div
                                    className={itemTab("more")}
                                    onClick={() => setActiveItemEditor("more")}
                                >
                                    More
                                </div> */}
                            </div>
                            {activeItemEditor === "details" && (
                                <div>

                                    <div className="item-name mt-4">
                                        <label htmlFor="item_name" className="block cairo">
                                            اسم العرض <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="item_name"
                                            value={itemName}
                                            onChange={(e) => setItemName(e.target.value)}
                                            className="w-full cairo text-sm p-1 mt-2 rounded-md border-2 h-9"
                                            placeholder="عرض الجامدين"
                                            required
                                        />
                                    </div>

                                    <div className="item-description mt-4">
                                        <p className="text-sm cairo">الوصف</p>
                                        <textarea
                                            rows="3"
                                            name="description"
                                            value={itemDesc}
                                            style={{ resize: "none" }}
                                            className="w-full cairo text-sm mt-3 p-3 border rounded-md"
                                            placeholder="اضف وصف لعرضك ..."
                                            onChange={(e) => setItemDesc(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="item-image mt-4">
                                        <p className="text-sm cairo">الصورة</p>
                                        <input
                                            type="file"
                                            name="item_image"
                                            accept="image/jpeg, image/png"
                                            onChange={handleItemFileChange}
                                            className="hidden"
                                            id="item_image_upload"
                                        />
                                        <label htmlFor="item_image_upload">
                                            <div className="img border hover:border-dashed hover:border-blue-700 mt-2 w-44 h-44 flex flex-col justify-center items-center px-6 rounded-md bg-slate-100 cursor-pointer">
                                                {preview ? (
                                                    <img src={preview} alt="Preview" className="w-full h-full rounded-md" />
                                                ) : (
                                                    <>
                                                        <i className="fa-solid fa-arrow-up-from-bracket text-2xl text-blue-500"></i>
                                                        <p className="mt-3">Upload</p>
                                                        <p className="text-sm text-gray-500">Only jpg, jpeg, png files are supported</p>
                                                    </>
                                                )}
                                            </div>
                                        </label>
                                    </div>

                                    <div className="item-first-price my-4 " >
                                        <label className="block cairo mb-3" htmlFor="">
                                            السعر
                                        </label>
                                        <input
                                            className="rounded-md w-44 h-9 cairo border-2 px-2"
                                            placeholder="0,00"
                                            type="text"
                                            value={firstPrice}
                                            onChange={(e) => setFirstPrice(e.target.value)}

                                        />
                                    </div>




                                </div>
                            )}


                            {/* Submit Buttons */}
                            <div className="edit-action flex justify-end items-center px-6 gap-3 absolute border shadow-lg bottom-0 left-0 right-0 h-14 bg-white">
                                <button type="button" onClick={closeAddItemForm} className="close-form cairo py-2 px-4 bg-gray-200 rounded-md">
                                    الغاء
                                </button>
                                <button type="submit" className="py-2 cairo px-6 rounded-md text-white bg-green-600">
                                    حفظ
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

            <div className="container md:px-0 md:w-4/5 w-full px-2 pt-3">
                {sectionToDelete && (
                    <div className="confirm-delete-modal-section fixed flex justify-center pt-32 inset-0 bg-black/20 z-40">

                        <div className="confirm-delete-form md:w-1/4 w-4/5 h-fit p-8 flex flex-col justify-center items-center animate-slide-down  bg-white rounded-md shadow-lg">
                            <i className="text-gray-500 text-3xl fa-regular fa-trash-can"></i>
                            <p className='cairo text-center'>هل انت متأكد من حذف: <strong>{sectionToDelete.name}</strong> </p>
                            <div className="action-btns flex gap-2 mt-4 ">
                                <button onClick={() => deleteSectionApi(sectionToDelete.id)} className='bg-red-500 text-white text-sm rounded-sm  cairo   py-2 px-4'>نعم متأكد</button>
                                <button onClick={handleCloseDeleteModal} className='bg-slate-50 border text-sm rounded-sm  cairo   py-2 px-4'>لا , تراجع</button>

                            </div>



                        </div>

                    </div>
                )}
                {itemToDelete && (
                    <div className="confirm-delete-modal-item fixed flex justify-center pt-32 inset-0 bg-black/20 z-40">

                        <div className="confirm-delete-form md:w-1/4 w-4/5 h-fit p-8 flex flex-col justify-center items-center animate-slide-down  bg-white rounded-md shadow-lg">
                            <i className="text-gray-500 text-3xl fa-regular fa-trash-can"></i>
                            <p className='cairo text-center'>هل انت متأكد من حذف: <strong>{itemToDelete.name}</strong> </p>
                            <div className="action-btns flex gap-2 mt-4 ">
                                <button onClick={() => deleteItem(itemToDelete.id)} className='bg-red-500 text-white text-sm rounded-sm  cairo   py-2 px-4'>نعم متأكد</button>
                                <button onClick={handleCloseDeleteModal} className='bg-slate-50 border text-sm rounded-sm  cairo   py-2 px-4'>لا , تراجع</button>

                            </div>



                        </div>

                    </div>
                )}
                <div className="flex bg-white mb-4 border-b border-gray-200 pt-2  ">
                    <div
                        className={sectionTab("items")}
                        onClick={() => setActiveSectionEditor("items")}
                    >
                        المنيو
                    </div>


                    <div
                        className={sectionTab("social")}
                        onClick={() => setActiveSectionEditor("social")}
                    >
                        السوشيال ميديا
                    </div>
                </div>


                {activeSectionEditor === "items" && (
                    <div>
                        <div className="live-menu shadow-md flex justify-between bg-white p-3 rounded-lg">
                            <p className='cairo'>نشاط المنيو</p>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={menuData?.is_closed || true}
                                    onChange={async () => {
                                        try {
                                            const newStatus = !menuData?.is_closed;
                                            await axios.post(`${apiUrl}/api/menu/update/${m_id}`, {
                                                is_closed: newStatus
                                            }, {
                                                headers: authHeader(),
                                            });
                                            console.log(newStatus);


                                            setMenuData(prev => ({ ...prev, is_closed: newStatus }));
                                            toast.success(newStatus ? "تم تنشيط المنيو" : "تم الغاء تنشيط المنيو");
                                        } catch (error) {
                                            toast.error("Failed to update menu status");
                                            console.error("Error updating menu status:", error);
                                        }
                                    }}
                                />
                                <div className={`
      group peer rounded-full duration-300 w-8 h-4 ring-2 
      ${menuData?.is_closed ? 'bg-green-500 ring-green-300' : 'bg-gray-300 ring-gray-300'}
      after:duration-300 after:bg-white after:rounded-xl after:absolute 
      after:h-4 after:w-4 after:top-1 after:left-0 
      after:flex after:justify-center after:items-center
      ${menuData?.is_closed ? 'after:translate-x-4' : ''}
      peer-hover:after:scale-95
    `}></div>
                            </label>
                        </div>
                        <div className="search shadow-sm mt-4 relative">
                            <input
                                className="w-full rounded-lg p-3 pl-10"
                                type="search"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>

                        <p className='cairo text-sky-700 font-semibold text-lg mt-3'>الأقسام</p>

                        <div onClick={openAddSectionForm} className="add-category hover:bg-slate-50 cursor-pointer hover:shadow-md mt-4 shadow-sm flex justify-between bg-white p-3 rounded-lg">
                            <p className='cairo'> اضافة قسم +  </p>
                        </div>
                        {isSectionsLoading ? (<>
                            <div className="sections-loading bg-slate-200/60 animate-pulse min-h-screen">



                            </div>
                        </>) : (

                            <div className="categories mt-6">
                                {sections.length > 0 ? (
                                    filterSections(sections).map((section, index) => (
                                        <div
                                            key={section.id}
                                            className={`category mt-2 `}
                                        >
                                            <div
                                                onClick={() => {
                                                    openEditSectionForm(section.id);
                                                    toggleCategoryItems(section.id);
                                                    toggleCategoryMenu();
                                                    setSelectedSection(section);

                                                }}
                                                className="category-parent cursor-pointer hover:bg-slate-50 shadow-lg flex justify-between p-3 bg-white rounded-lg"
                                            >
                                                <div className="left flex items-center gap-2">

                                                    <div className="flex flex-col mr-2">


                                                        <div className="group relative ">
                                                            <i
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    moveSectionUp(section.id);
                                                                }}
                                                                className={`fa-solid fa-chevron-up text-xs ${index === 0 ? 'text-gray-300 cursor-default' : 'text-gray-500 hover:text-gray-700 cursor-pointer'
                                                                    }`}
                                                            ></i>    <div
                                                                className="bg-zinc-500 px-3 py-1 rounded-md group-hover:flex hidden absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2"
                                                            >
                                                                <span className="text-white whitespace-nowrap">up</span>
                                                                <div
                                                                    className="bg-inherit rotate-45 p-1 absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2"
                                                                ></div>
                                                            </div>
                                                        </div>

                                                        <div className="group relative  ">
                                                            <i
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    moveSectionDown(section.id);
                                                                }}
                                                                className={`fa-solid fa-chevron-down text-xs ${index === sections.length - 1 ? 'text-gray-300 cursor-default' : 'text-gray-500 hover:text-gray-700 cursor-pointer'
                                                                    }`}
                                                            ></i>                                                            <div
                                                                className="bg-zinc-500 p-2 rounded-md group-hover:flex hidden absolute -bottom-2 translate-y-full left-1/2 -translate-x-1/2"
                                                            >
                                                                <span className="text-white whitespace-nowrap">Down</span>
                                                                <div
                                                                    className="bg-inherit rotate-45 p-1 absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2"
                                                                ></div>
                                                            </div>
                                                        </div>


                                                    </div>

                                                    <img className="w-10 h-10 rounded-md" src={section.cover_image_url ? section.cover_image_url : def} alt='' />

                                                    <p className="truncate md:max-w-[400px] sm:max-w-80 max-w-24 text-ellipsis overflow-hidden whitespace-nowrap" > {section.name}</p>
                                                </div>
                                                <div className="right flex gap-4 items-center">


                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={section.is_available}
                                                            onChange={async (e) => {
                                                                e.stopPropagation();

                                                                try {
                                                                    const newStatus = !section.is_available;
                                                                    await axios.post(`${apiUrl}/api/section/update/${section.id}`, {
                                                                        is_available: newStatus
                                                                    },
                                                                        {
                                                                            headers: authHeader(),
                                                                        });
                                                                    // Update local state
                                                                    setSections(prev => prev.map(s =>
                                                                        s.id === section.id ? { ...s, is_available: newStatus } : s
                                                                    ));
                                                                    toast.success(newStatus ? "تم تنشيط القسم" : "تم الغاء تنشيط القسم");
                                                                } catch (error) {
                                                                    toast.error("Failed to update section status");
                                                                    console.error("Error:", error);
                                                                }
                                                            }}
                                                        />
                                                        <div className={`
group peer rounded-full duration-300 w-8 h-4 ring-2 
${section.is_available ? 'bg-green-500 ring-green-300' : 'bg-gray-300 ring-gray-300'}
after:duration-300 after:bg-white after:rounded-xl after:absolute 
after:h-4 after:w-4 after:top-0 after:left-0 
after:flex after:justify-center after:items-center
${section.is_available ? 'after:translate-x-4' : ''}
peer-hover:after:scale-95
`}></div>
                                                    </label>
                                                    <p
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent parent click events
                                                            handleDeleteClick(section); // Call the delete handler
                                                        }}
                                                        className='text-sm flex gap-2 items-center border-b-2 border-slate-400/25   rounded-sm hover:bg-slate-100 p-1 cursor-pointer'
                                                    >
                                                        <i
                                                            className="text-red-500 fa-regular fa-trash-can"></i>
                                                    </p>

                                                    <i
                                                        className="fa-solid fa-chevron-down p-2 cursor-pointer transform transition-transform duration-300"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleCategoryItems(section.id);
                                                        }}
                                                    ></i>
                                                </div>
                                            </div>

                                            <div
                                                className="category-items flex flex-col items-end overflow-hidden transition-max-height duration-500 ease-in-out"
                                                style={{ maxHeight: expandedCategories[section.id] ? '2000px' : '0px' }}
                                            >
                                                {filterItems(section.items).map((item, itemIndex) => (
                                                    <div
                                                        onClick={() => {
                                                            openEditItemForm(event, item),
                                                                setSelectedItem(item)
                                                        }}
                                                        key={item.id}
                                                        className="item p-2 mt-2 hover:bg-slate-200 cursor-pointer rounded-md w-[97%] flex gap-2 justify-between bg-white"
                                                    >
                                                        <div className="left md:w-2/3 w-1/2 flex items-center gap-2">
                                                            <div className="flex flex-col gap-2">

                                                                <i
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        moveItemUp(section.id, item.id);
                                                                    }}
                                                                    className={`fa-solid fa-chevron-up  bg-slate-100 p-1 rounded-md text-gray-400 hover:text-gray-600 ${itemIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                ></i>

                                                                <i
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        moveItemDown(section.id, item.id);
                                                                    }}
                                                                    className={`fa-solid fa-chevron-down bg-slate-100 p-1 rounded-md text-gray-400 hover:text-gray-600 ${itemIndex === section.items.length - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                ></i>
                                                            </div>
                                                            {/* Placeholder for item image */}
                                                            <img
                                                                className="w-7 h-7 rounded-md"
                                                                src={item.image_url ? item.image_url : def}
                                                                alt={item.name}
                                                            />


                                                            <p className='w-full md:text-base text-sm whitespace-nowrap text-ellipsis overflow-hidden'>{item.name}</p>
                                                        </div>                                                <div className="right flex md:gap-4 gap-2 items-center">
                                                            <div className="price-edit border flex p-1 rounded-md gap-2">
                                                                <p className='md:text-base text-sm'>EGP</p>
                                                                <input dir='ltr' className="md:w-14 w-12 md:text-base text-sm" type="text" value={item?.item_prices?.[0]?.price || "0"} readOnly />
                                                            </div>
                                                            {/* <label className="relative bg-red-400 p-2 inline-flex items-center cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    className="sr-only peer"
                                                                    checked={item.is_available}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    onChange={async (e) => {
                                                                        e.stopPropagation();
                                                                        e.preventDefault()
                                                                        await handleUpdateItemStatus(item.id, item.section_id, !item.is_available);
                                                                    }}
                                                                />
                                                                <div className={`
    group peer rounded-full duration-300 md:w-8 w-6 h-3 md:h-4 ring-2 
    ${item.is_available ? 'bg-green-500 ring-green-300' : 'bg-gray-300 ring-gray-300'}
    after:duration-300 after:bg-white after:rounded-xl after:absolute 
    md:after:h-4 after:h-3 md:after:w-4 after:w-3 after:top-0 after:left-0 
    after:flex after:justify-center after:items-center
    ${item.is_available ? 'md:after:translate-x-4 after:translate-x-3' : ''}
    peer-hover:after:scale-95
  `}></div>
                                                            </label> */}
                                                            <div
                                                                className="relative m-2 inline-flex items-center cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    e.preventDefault();
                                                                    handleUpdateItemStatus(item.id, item.section_id, !item.is_available);
                                                                }}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    className="sr-only"
                                                                    checked={item.is_available}
                                                                    readOnly // Important: Make input read-only
                                                                />
                                                                <div className={`
      group rounded-full duration-300 md:w-8 w-6 h-3 md:h-4 ring-2 
      ${item.is_available ? 'bg-green-500 ring-green-300' : 'bg-gray-300 ring-gray-300'}
      after:duration-300 after:bg-white after:rounded-xl after:absolute 
      md:after:h-4 after:h-3 md:after:w-4 after:w-3 after:top-0 after:left-0 
      ${item.is_available ? 'md:after:translate-x-4 after:translate-x-3' : ''}
    `}></div>
                                                            </div>


                                                            <p
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // Prevent parent click events
                                                                    handleItemDeleteClick(item); // Call the delete handler
                                                                }}
                                                                className='text-sm flex gap-2 items-center border-b-2 border-slate-400/25   rounded-sm hover:bg-slate-100 p-1 cursor-pointer'
                                                            >
                                                                <i
                                                                    className="text-red-500 fa-regular fa-trash-can"></i>
                                                            </p>

                                                            {/* <div className="more   relative">
                                                                <i
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleItemMoreClick(itemIndex);
                                                                    }}
                                                                    className="fa-solid px-2  text-slate-700 fa-ellipsis-vertical cursor-pointer"
                                                                ></i>

                                                                {activeItemMoreIndex === itemIndex && (
                                                                    <div className="dropdn absolute md:-right-28 -right-11 bg-white z-10  w-32 h-fit border rounded-md shadow-md">
                                                                        <p
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                // handleItemDuplicate(item); // Uncomment when you implement this
                                                                            }}
                                                                            className='text-sm flex gap-2 items-center border-b-2 border-slate-400/25 hover:bg-gray-100 p-2 cursor-pointer'
                                                                        >
                                                                            <i className="text-gray-500 fa-solid fa-clone"></i> Duplicate
                                                                        </p>
                                                                        <p
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                deleteItem(item.id);
                                                                            }}
                                                                            className='text-sm flex gap-2 items-center border-b-2 border-slate-400/25 hover:bg-gray-100 p-2 cursor-pointer'
                                                                        >
                                                                            <i
                                                                                className="text-gray-500 fa-regular fa-trash-can"></i> Delete
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                ))}
                                                <div onClick={() => openAddItemForm(section.id)} className="add-item hover:bg-slate-50 hover:shadow-md cursor-pointer w-[97%] mt-2 shadow-sm flex justify-between bg-white p-3 rounded-lg">
                                                    <p>   اضافة صنف + </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))) : (

                                    <div className="empty-sections flex flex-col justify-center items-center">
                                        <i className="fa-solid fa-arrow-up"></i>
                                        <p>لا يوجد اقسام اضف الأن</p>

                                    </div>


                                )}
                            </div>
                        )}



                        <p className='cairo text-sky-700 font-semibold text-lg mt-3'>العروض</p>
                        <div className="offer-section">
                            <div className="offer-section-items pb-5 pe-5 flex flex-col items-end overflow-hidden transition-max-height duration-500 ease-in-out">
                                {filterOfferItems(offerItems).map((item, itemIndex) => (
                                    <div
                                        onClick={() => {
                                            openEditOfferForm(item);
                                            setSelectedItem(item);
                                        }}
                                        key={item.id}
                                        className="item p-2 mt-2 hover:bg-slate-200 cursor-pointer rounded-md w-[97%] flex gap-2 justify-between bg-white"
                                    >
                                        <div className="left md:w-2/3 w-1/2 flex items-center gap-2">
                                            {/* Add reorder arrows here */}
                                            <div className="flex flex-col">

                                                <i
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        moveOfferItemUp(item.id);
                                                    }}
                                                    className={`fa-solid fa-chevron-up text-xs ${itemIndex === 0 ? 'text-gray-300 cursor-default' : 'text-gray-500 hover:text-gray-700 cursor-pointer'
                                                        }`}
                                                ></i>
                                                <i
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        moveOfferItemDown(item.id);
                                                    }}
                                                    className={`fa-solid fa-chevron-down text-xs ${itemIndex === offerItems.length - 1 ? 'text-gray-300 cursor-default' : 'text-gray-500 hover:text-gray-700 cursor-pointer'
                                                        }`}
                                                ></i>
                                            </div>

                                            <img
                                                className="w-7 h-7 rounded-md"
                                                src={item?.image_url || def} // Make sure 'def' is defined
                                                alt={item?.name}
                                            />
                                            <p className='w-full md:text-base text-sm whitespace-nowrap text-ellipsis overflow-hidden'>
                                                {item?.name}
                                            </p>
                                        </div>
                                        <div className="right flex md:gap-4 gap-2 items-center">
                                            <div className="price-edit border flex p-1 rounded-md gap-2">
                                                <p className='md:text-base text-sm'>EGP</p>
                                                <input
                                                    dir='ltr'
                                                    className="md:w-14 w-12 md:text-base text-sm"
                                                    type="text"
                                                    value={item?.item_prices?.[0]?.price || "0"}
                                                    readOnly
                                                />
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={item.is_available}
                                                    onChange={async (e) => {
                                                        e.stopPropagation();
                                                        await handleUpdateOfferStatus(item.id, !item.is_available);
                                                    }}
                                                />
                                                <div className={`
          group peer rounded-full duration-300 md:w-8 w-6 h-3 md:h-4 ring-2 
          ${item.is_available ? 'bg-green-500 ring-green-300' : 'bg-gray-300 ring-gray-300'}
          after:duration-300 after:bg-white after:rounded-xl after:absolute 
          md:after:h-4 after:h-3 md:after:w-4 after:w-3 after:top-0 after:left-0 
          after:flex after:justify-center after:items-center
          ${item.is_available ? 'md:after:translate-x-4 after:translate-x-3' : ''}
          peer-hover:after:scale-95
        `}></div>
                                            </label>
                                            <p
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent parent click events
                                                    handleItemDeleteClick(item); // Call the delete handler
                                                }}
                                                className='text-sm flex gap-2 items-center border-b-2 border-slate-400/25   rounded-sm hover:bg-slate-100 p-1 cursor-pointer'
                                            >
                                                <i
                                                    className="text-red-500 fa-regular fa-trash-can"></i>
                                            </p>
                                            {/* <div className="more relative">
                                                <i
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOfferMoreClick(itemIndex);
                                                    }}
                                                    className="fa-solid px-2 bg-green-400 text-slate-700 fa-ellipsis-vertical cursor-pointer"
                                                ></i>
                                                {activeOfferMoreIndex === itemIndex && (
                                                    <div className="dropdn absolute md:-right-20 -right-11 z-30 w-32 h-fit border bg-white rounded-md shadow-md">
                                                        <p
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // handleItemDuplicate(item);
                                                            }}
                                                            className='text-sm flex gap-2 items-center border-b-2 border-slate-400/25 hover:bg-gray-100 p-2 cursor-pointer'
                                                        >
                                                            <i className="text-gray-500 fa-solid fa-clone"></i> Duplicate
                                                        </p>
                                                        <p
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteItem(item.id);
                                                            }}
                                                            className='text-sm flex gap-2 items-center border-b-2 border-slate-400/25 hover:bg-gray-100 p-2 cursor-pointer'
                                                        >
                                                            <i className="text-gray-500 fa-regular fa-trash-can"></i> Delete
                                                        </p>
                                                    </div>
                                                )}
                                            </div> */}
                                        </div>
                                    </div>
                                ))}
                                <div
                                    onClick={() => openAddOfferForm()}
                                    className="add-item hover:bg-slate-50 hover:shadow-md cursor-pointer w-[97%] mt-2 shadow-sm flex justify-between bg-white p-3 rounded-lg"
                                >
                                    <p className='cairo'>
                                        اضافة عرض + </p>
                                </div>
                            </div>
                        </div>



                    </div>
                )}

                {activeSectionEditor === "social" && (
                    <div className="social p-4 w-full bg-white">
                        <p className='text-lg font-medium'>اضف روابط السوشيال ميديا </p>

                        <div className="social-app whatsapp lg:w-2/5 md:w-3/5 sm:w-4/5 p-3 mt-3 rounded-md bg-slate-100">
                            <div className="social-logo flex flex-col items-center justify-center">
                                <img src={wp} className="w-16 h-16 rounded-full" alt="WhatsApp Logo" />
                            </div>

                            <input
                                className="w-3/4 mt-5 px-2 rounded-md disabled:bg-gray-300 border h-9"
                                type="text"
                                value={tempWhatsAppUrl}
                                onChange={(e) => setTempWhatsAppUrl(e.target.value)}
                                disabled={isWhatsappDisabled}
                            />

                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <>
                                    {isUpdateWhatsApp ? (
                                        <button className="bg-sky-200 h-9 px-4 mt-2" onClick={handleUpdateWhatsAppClick}>
                                            Update
                                        </button>
                                    ) : (
                                        <button className="bg-green-500 text-white h-9 px-4 mt-2" onClick={handleSaveWhatsAppClick}>
                                            Save
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="social-app facebook lg:w-2/5 md:w-3/5 sm:w-4/5 p-3 mt-3 rounded-md bg-slate-100">
                            <div className="social-logo flex flex-col items-center justify-center">
                                <img src={fb} className="w-16 h-16 rounded-full" alt="Facebook Logo" />
                            </div>

                            <input
                                className="w-3/4 mt-5 px-2 rounded-md disabled:bg-gray-300 border h-9"
                                type="text"
                                value={tempFacebookUrl}
                                onChange={(e) => setTempFacebookUrl(e.target.value)}
                                disabled={isFacebookDisabled}
                            />

                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <>
                                    {isUpdateFacebook ? (
                                        <button className="bg-sky-200 h-9 px-4 mt-2" onClick={handleUpdateFacebookClick}>
                                            Update
                                        </button>
                                    ) : (
                                        <button className="bg-green-500 text-white h-9 px-4 mt-2" onClick={handleSaveFacebookClick}>
                                            Save
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="social-app instagram lg:w-2/5 md:w-3/5 sm:w-4/5 p-3 mt-3 rounded-md bg-slate-100">
                            <div className="social-logo flex flex-col items-center justify-center">
                                <img src={insta} className="w-16 h-16 rounded-full" alt="Instagram Logo" />
                            </div>

                            <input
                                className="w-3/4 mt-5 px-2 rounded-md disabled:bg-gray-300 border h-9"
                                type="text"
                                value={tempInstagramUrl}
                                onChange={(e) => setTempInstagramUrl(e.target.value)}
                                disabled={isInstagramDisabled}
                            />

                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <>
                                    {isUpdateInstagram ? (
                                        <button className="bg-sky-200 h-9 px-4 mt-2" onClick={handleUpdateInstagramClick}>
                                            Update
                                        </button>
                                    ) : (
                                        <button className="bg-green-500 text-white h-9 px-4 mt-2" onClick={handleSaveInstagramClick}>
                                            Save
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="social-app location lg:w-2/5 md:w-3/5 sm:w-4/5 p-3 mt-3 rounded-md bg-slate-100">
                            <div className="social-logo flex flex-col items-center justify-center">
                                <img src={location} className="w-16 h-16 rounded-full" alt="Location Logo" />
                            </div>

                            <input
                                className="w-3/4 mt-5 px-2 rounded-md disabled:bg-gray-300 border h-9"
                                type="text"
                                value={tempLocationUrl}
                                onChange={(e) => setTempLocationUrl(e.target.value)}
                                disabled={isLocationDisabled}
                            />

                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <>
                                    {isUpdateLocation ? (
                                        <button className="bg-sky-200 h-9 px-4 mt-2" onClick={handleUpdateLocationClick}>
                                            Update
                                        </button>
                                    ) : (
                                        <button className="bg-green-500 text-white h-9 px-4 mt-2" onClick={handleSaveLocationClick}>
                                            Save
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                        <p className="text-lg font-medium mt-3">Add Your Phone Numbers</p>

                        {/* <div className="social-app phones lg:w-2/5 md:w-3/5 sm:w-4/5 p-3 mt-3 rounded-md bg-slate-100">
                            <div className="social-logo flex flex-col items-center justify-center">
                                <img src={call} className='w-16 h-16 rounded-full' alt="" />

                            </div>
                            {phones.map((phone, index) => (
                                <div key={index} className="flex gap-3 mt-3 items-center">
                                    <input
                                        className="w-3/4 rounded-md border h-9 px-2"
                                        type="text"
                                        value={phone}
                                        placeholder={index === 0 ? "Default Number" : "Additional Number"}
                                    />
                                    {index !== 0 && (
                                        <button onClick={() => deletePhone(index)}>
                                            <img src={minus} className="w-8 h-8 cursor-pointer" alt="Delete" />
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button className="flex gap-2 mt-4 items-center text-[#2a7696]" onClick={addPhone}>
                                <i className="fa-solid fa-plus"></i>
                                Add Phone Number
                            </button>
                            <div className="save-phones flex justify-end">
                                <button className='bg-sky-200  h-9 px-4'>save</button>

                            </div>

                        </div> */}
                        <div className="social-app phones lg:w-2/5 md:w-3/5 sm:w-4/5 p-3 mt-3 rounded-md bg-slate-100">
                            <div className="social-logo flex flex-col items-center justify-center">
                                <img src={call} className='w-16 h-16 rounded-full' alt="" />
                            </div>

                            {phones.map((phone, index) => (
                                <div key={index} className="flex gap-3 mt-3 items-center">
                                    <input
                                        className="w-3/4 rounded-md border h-9 px-2"
                                        type="text"
                                        value={phone}
                                        placeholder={index === 0 ? "Default Number" : "Additional Number"}
                                        onChange={(e) => handlePhoneChange(index, e.target.value)}
                                    />
                                    {phones.length > 1 && (
                                        <button onClick={() => deletePhone(index)}>
                                            <img src={minus} className="w-8 h-8 cursor-pointer" alt="Delete" />
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button className="flex gap-2 mt-4 items-center text-[#2a7696]" onClick={addPhone}>
                                <i className="fa-solid fa-plus"></i>
                                Add Phone Number
                            </button>

                            <div className="save-phones flex justify-end">
                                <button className='bg-sky-200 h-9 px-4' onClick={savePhones}>Save</button>
                            </div>
                        </div>



                    </div>



                )}




            </div>
        </div >) : (<NewMenuCreation onMenuSelect={(type) => {
            setIsMenuLoading(true)
            if (type === "scratch") {
                setScratchMenu(true);
                setIsMenuLoading(false)

            }
            if (type === "sample") {
                setSampleMenu(true);
                createSample(m_id); // Call your function here
            }
        }} />)}


    </>
}
