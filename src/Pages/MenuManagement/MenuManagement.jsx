import React, { useEffect, useRef, useState } from 'react';
import { createFormData } from '../../utils'
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
import { useParams } from 'react-router-dom';
import NewMenuCreation from '../../Components/NewMenuCreation/NewMenuCreation.jsx';



import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';



export default function MenuManagement() {


    const [sections, setSections] = useState([]);
    //     const [sectionData, setSectionData] = useState([

    // name: "",
    // note:"",


    //     ]);

    const [expandedCategories, setExpandedCategories] = useState({});
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
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


    const reorderingItems = async (reorderedData) => {

        try {
            await axios.post("http://localhost:234/api/items/reorder", reorderedData);

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
                                                openEditItemForm(item),
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
    const moveSection = (sectionId, direction) => {
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
    const handleItemMoreClick = (index) => {
        setActiveItemMoreIndex(activeItemMoreIndex === index ? null : index);
    };

    const handleOfferMoreClick = (index) => {
        setActiveOfferMoreIndex(activeOfferMoreIndex === index ? null : index);
    };

    const handleItemDeleteClick = (item) => {
        // Your delete logic here
        console.log("Deleting item:", item);
        setActiveItemMoreIndex(null); // Close the menu after action
    };


    // const handlePriceChange = (index, field, value) => {
    //     const updatedPrices = [...prices];
    //     updatedPrices[index][field] = value;
    //     setPrices(updatedPrices);
    // };


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

    // async function getSections(m_id) {
    //     try {
    //         // Fetch sections using 
    //         const response = await axios.get(`http://localhost:234/api/menusection/${m_id}`);
    //         console.log(response);

    //         if (response.data) {
    //             const sectionsWithImages = await Promise.all(
    //                 response.data.map(async (section) => {
    //                     let coverImageUrl = null;

    //                     // Fetch section cover image if available
    //                     if (section.cover_image) {
    //                         try {
    //                             const imageResponse = await axios.get(
    //                                 `http://localhost:234/api/file/${section.cover_image}`,
    //                                 { responseType: "blob" } // Fetch image as blob
    //                             );
    //                             coverImageUrl = URL.createObjectURL(imageResponse.data);
    //                         } catch (imageError) {
    //                             console.error(`Error fetching cover image for ${section.cover_image}`, imageError);
    //                         }
    //                     }

    //                     // Fetch images for section items
    //                     const itemsWithImages = await Promise.all(
    //                         section.items.map(async (item) => {
    //                             let itemImageUrl = null;

    //                             if (item.image) {
    //                                 try {
    //                                     const itemImageResponse = await axios.get(
    //                                         `http://localhost:234/api/file/${item.image}`,
    //                                         { responseType: "blob" }
    //                                     );
    //                                     itemImageUrl = URL.createObjectURL(itemImageResponse.data);
    //                                 } catch (itemImageError) {
    //                                     console.error(`Error fetching item image for ${item.image}`, itemImageError);
    //                                 }
    //                             }

    //                             return { ...item, image_url: itemImageUrl };
    //                         })
    //                     );

    //                     return {
    //                         ...section,
    //                         cover_image_url: coverImageUrl,
    //                         items: itemsWithImages, // Include updated items with images
    //                     };
    //                 })
    //             );

    //             console.log(sectionsWithImages);
    //             setSections(sectionsWithImages); // Update state with sections and images
    //             console.log("sections", sections);

    //         } else if (response.data.message == "Sections not found for the given MenuId") {

    //             console.log("no sections");


    //         }
    //     } catch (error) {
    //         console.error("Error fetching sections:", error);
    //         toast.error("حدث خطأ أثناء جلب الأقسام");

    //         // Fallback dummy data
    //     }
    // }

    // async function getSections(m_id) {
    //     try {
    //         const response = await axios.get(`http://localhost:234/api/menusection/${m_id}`);

    //         if (!response.data || response.data.message === "Sections not found") {
    //             console.log("No sections found for this menu");
    //             setSections([]); // Set empty array
    //             return;
    //         }

    //         const sectionsWithImages = await Promise.all(
    //             response.data.map(async (section) => {
    //                 let coverImageUrl = null;
    //                 if (section.cover_image) {
    //                     try {
    //                         const imageResponse = await axios.get(
    //                             `http://localhost:234/api/file/${section.cover_image}`,
    //                             { responseType: "blob" }
    //                         );
    //                         coverImageUrl = URL.createObjectURL(imageResponse.data);
    //                     } catch (imageError) {
    //                         console.error("Error fetching cover image:", imageError);
    //                     }
    //                 }

    //                 const itemsWithImages = await Promise.all(
    //                     section.items.map(async (item) => {
    //                         let itemImageUrl = null;
    //                         if (item.image) {
    //                             try {
    //                                 const itemImageResponse = await axios.get(
    //                                     `http://localhost:234/api/file/${item.image}`,
    //                                     { responseType: "blob" }
    //                                 );
    //                                 itemImageUrl = URL.createObjectURL(itemImageResponse.data);
    //                             } catch (itemImageError) {
    //                                 console.error("Error fetching item image:", itemImageError);
    //                             }
    //                         }
    //                         return { ...item, image_url: itemImageUrl };
    //                     })
    //                 );

    //                 return { ...section, cover_image_url: coverImageUrl, items: itemsWithImages };
    //             })
    //         );

    //         setSections(sectionsWithImages);
    //     } catch (error) {
    //         if (error.response?.status === 404) {
    //             console.log("Menu or sections not found");
    //             setSections([]);
    //         } else {
    //             console.error("Error fetching sections:", error);
    //             toast.error("حدث خطأ أثناء جلب الأقسام");
    //         }
    //     }
    // }

    async function getOfferSectionWithItems(m_id) {
        try {
            const response = await axios.get(`http://localhost:234/api/menu-offers-owner/${m_id}`);

            if (!response.data || response.data.message === "Sections not found") {
                console.log("No sections found for this menu");
                return { sectionId: null, items: [] };
            }

            // Find the offer section (is_offer = true)
            const offerSection = response.data[0]

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
                                `http://localhost:234/api/file/${item.image}`,
                                { responseType: "blob" }
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
            const response = await axios.get(`http://localhost:234/api/menusection-owner/${m_id}`);

            if (!response.data || response.data.message === "Sections not found") {
                console.log("No sections found for this menu");
                setSections([]);
                return;
            }

            // Filter out sections where is_offer is true
            const nonOfferSections = response.data

            const sectionsWithImages = await Promise.all(
                nonOfferSections.map(async (section) => {  // Only process non-offer sections
                    let coverImageUrl = null;
                    if (section.cover_image) {
                        try {
                            const imageResponse = await axios.get(
                                `http://localhost:234/api/file/${section.cover_image}`,
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
                                        `http://localhost:234/api/file/${item.image}`,
                                        { responseType: "blob" }
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

            setTimeout(() => {
                setIsMenuLoading(false)

            }, 1500);

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
    // let offerSectionId = null; // Global variable to store offer section ID



    // Usage example:
    // const { sectionId, items } = await getOfferSectionWithItems(menuId);
    // console.log("Offer Section ID:", sectionId);
    // console.log("Offer Items:", items);
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

                    setIsAddFormVisible(false)

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
            const response = await axios.get(`http://localhost:234/api/contacts/${m_id}`);
            if (response.data.length > 0) {
                setPhones(response.data.map(contact => contact.phone)); // Assuming API returns an array of objects with a `phone` field
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

            const response = await axios.get(`http://localhost:234/api/menu/${menu_id}`);
            console.log(response.data);


            // Check if current time >= end_time (one-time check)
            // Set menu settings
            setMenuData(response.data);
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
            const response = await axios.get(`http://localhost:234/api/menusocial/${menu_id}`);

            if (response.data) {

                // ===== FACEBOOK =====
                const firstFacebook = response.data.find((item) => item.platform === "facebook");
                if (firstFacebook) {
                    setTempFacebookUrl(firstFacebook.url);
                    setFacebookUrl(firstFacebook.url);
                    setIsFacebookDisabled(true);
                    setIsUpdateFacebook(true);
                }

                // ===== WHATSAPP =====
                const firstWhatsapp = response.data.find((item) => item.platform === "whatsapp");
                if (firstWhatsapp) {
                    const phoneNumber = firstWhatsapp.url.replace("https://wa.me/", "");
                    setTempWhatsAppUrl(phoneNumber);
                    setWhatsAppUrl(firstWhatsapp.url);
                    setIsWhatsAppDisabled(true);
                    setIsUpdateWhatsApp(true);
                }

                // ===== INSTAGRAM =====
                const firstInstagram = response.data.find((item) => item.platform === "instagram");
                if (firstInstagram) {
                    setTempInstagramUrl(firstInstagram.url);
                    setInstagramUrl(firstInstagram.url);
                    setIsInstagramDisabled(true);
                    setIsUpdateInstagram(true);
                }

                // ===== LOCATION (Google Maps) =====
                const firstLocation = response.data.find((item) => item.platform === "location");
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

    // const fetchWhatsappAccount = async (menu_id) => {


    //     try {
    //         console.log("whatsapp-id", menu_id);

    //         const response = await axios.get(`http://localhost:234/api/whatsapp-account/${menu_id}`);

    //         if (response.data && response.data.url) {
    //             let url = response.data.url;
    //             let phoneNumber = url.replace("https://wa.me/", "");

    //             // setFacebookAccount(response.data);
    //             setWhatsAppUrl(response.data.url);
    //             setTempWhatsAppUrl(phoneNumber); // Sync temp value
    //             setIsWhatsAppDisabled(true); // Disable input if URL exists
    //             setIsUpdateWhatsApp(true); // Show "Update" button            } else {


    //             // setFacebookAccount(null);
    //         }
    //     } catch (err) {
    //         console.log(err);

    //         // setFacebookAccount(null);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
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
            await axios.post("http://localhost:234/api/social/update", {
                menu_id: m_id,
                platform: "location",
                url: tempLocationUrl, // Use tempLocationUrl directly
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

            await axios.post("http://localhost:234/api/social/update", {
                menu_id: m_id,
                platform: "facebook",
                url: tempFacebookUrl, // Use tempFacebookUrl directly
            });

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

            // console.log(m_id);

            const whatsappNumber = `https://wa.me/${tempWhatsAppUrl}`
            await axios.post("http://localhost:234/api/social/update", {
                menu_id: m_id,
                platform: "whatsapp",
                url: whatsappNumber, // Use tempWhatsAppUrl directly
            });

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
            await axios.post("http://localhost:234/api/social/update", {
                menu_id: m_id,
                platform: "instagram",
                url: tempInstagramUrl, // Use tempInstagramUrl directly
            });

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

    const openEditItemForm = (item) => {
        console.log(item);

        setSelectedItem(item);
        setIsEditItemFormVisible(true);
    };
    const openEditOfferForm = (item) => {
        console.log(item);

        setSelectedItem(item);
        setIsEditOfferFormVisible(true);
    };


    const closeEditItemForm = () => {
        setSelectedItem(null);
        setItemFile(null)
        setIsEditItemFormVisible(false);
    };

    const closeEditOfferForm = () => {
        setSelectedItem(null);
        setItemFile(null)
        setIsEditOfferFormVisible(false);
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


            // Fetch the updated sections after adding the new section
            await getOfferSectionWithItems(m_id);
            await getSections(m_id)
            // Clear the input fields
            setItemName('');
            setItemDesc('');
            setItemFile(null);
            setPreview(null)
            setFirstPrice('')
            window.location.reload();


        } catch (error) {
            console.error('Error adding section:', error);
            toast.error('حدث خطأ أثناء اضافة المنتج');
        }


    }


    async function handleAddItemSubmit(event) {
        event.preventDefault();
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
            await addItemApi(itemObject, itemFile, toastMessage);
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



        const response = await axios.post("http://localhost:234/api/item", itemPayload);
        console.log("Item successfully created:", response.data);
        toast.success(toastMessage);
        closeAddItemForm()




    }
    async function handleUpdateSection(event) {
        event.preventDefault();
        // console.log(selectedSection);
        // console.log(sectionFile);

        const sectionObject = {
            // menu_id: m_id,
            // section_id: selectedSectionId,
            name: selectedSection.name,
            description: selectedSection.note,

        }

        // console.log(sectionObject);
        try {
            // Await the API call to ensure completion

            console.log(sectionObject, sectionFile, selectedSectionId);


            await updateSectionApi(sectionObject, sectionFile, selectedSectionId);

            // Fetch the updated sections after adding the new section
            await getSections(m_id);
            // Clear the input fields
            // setItemName('');
            // setItemDesc('');
            // setItemFile(null);
            setSectionFile(null)
            // setIsFormVisible(null)
            toggleFormVisibility()

            setPreview(null)
            // setFirstPrice('')
        } catch (error) {
            console.error('Error update section:', error);
            // toast.error('حدث خطأ أثناء اضافة المنتج');
        }





    }

    const updateSectionApi = async (stateObject, file, sectionId) => {


        const serverPayload = file ? createFormData(stateObject, file, "cover_image") : stateObject;
        console.log(serverPayload);


        const response = await axios.post(`http://localhost:234/api/section/update/${sectionId}`, serverPayload);
        console.log(response)
        toast.success('تم التعديل بنجاح');


    }







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
    async function handleUpdateItemStatus(itemId, newStatus) {
        setIsEditItemFormVisible(false)
        console.log(newStatus);

        try {
            const payload = {
                is_available: newStatus,
                section_id: selectedItem.section_id
            };

            await axios.post(`http://localhost:234/api/item/update-availability/${itemId}`, payload);

            // Update local state
            setSections(prevSections =>
                prevSections.map(s => ({
                    ...s,
                    items: s.items.map(i =>
                        i.id === itemId ? { ...i, is_available: newStatus } : i
                    )
                }))
            );

            toast.success(`Item ${newStatus ? 'activated' : 'deactivated'}`);
        } catch (error) {
            toast.error("Failed to update item status");
            console.error("Error:", error.response?.data || error.message);
        }
    }

    async function handleUpdateOfferStatus(itemId, newStatus) {
        try {
            const payload = {
                is_available: newStatus,
                section_id: selectedItem?.section_id || offerSectionId
            };

            await axios.post(`http://localhost:234/api/item/update-availability/${itemId}`, payload);

            // Update local state for offer items
            setOfferItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId ? { ...item, is_available: newStatus } : item
                )
            );

            toast.success(`Offer ${newStatus ? 'activated' : 'deactivated'}`);
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
            await updateItemApi(itemId, itemObject, itemFile);
            // Fetch the updated sections after adding the new section
            await getSections(m_id);
            // Clear the input fields
            toast.success("ssssssssss")
            // setItemName('');
            // setItemDesc('');
            // setItemFile(null);
            // setPreview(null)
            // setFirstPrice('')
        } catch (error) {
            console.error('Error adding section:', error);
            toast.error('حدث خطأ أثناء تعديل المنتج');
        }






    }
    const updateItemApi = async (itemId, itemObject, file) => {

        const itemPayload2 = file ? createFormData(itemObject, file, "image") : itemObject;


        console.log("payload", itemPayload2);

        const response = await axios.post(`http://localhost:234/api/item/update/${itemId}`, itemPayload2);
        console.log("Item successfully created:", response.data);
        toast.success("Item created successfully!");





    }


    // const updateItemApi = async (stateObject, file, sectionId) => {


    //     const serverPayload = file ? createFormData(stateObject, file, "cover_image") : stateObject;
    //     console.log(serverPayload);


    //     const response = await axios.post(`http://localhost:234/api/section/update/${sectionId}`, serverPayload);
    //     console.log(response)
    //     toast.success('تم التعديل بنجاح');


    // }



    const openAddItemForm = (sectionId) => {
        setSelectedSectionId(sectionId);
        setAddItemFormVisible(true);
    };
    const openAddOfferForm = () => {
        // setSelectedSectionId(sectionId);
        setAddOfferFormVisible(true);
    };

    const closeAddItemForm = () => {
        setSelectedSectionId(null);
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

    const handleCloseDeleteModal = () => {
        setSectionToDelete(null); // Close the modal by clearing the state
    };


    // Function to handle the category reordering after drag end
    const handleMoveSection = (fromIndex, toIndex) => {
        const updatedSections = [...sections];
        const [movedSection] = updatedSections.splice(fromIndex, 1); // Remove the section from its current position
        updatedSections.splice(toIndex, 0, movedSection); // Insert the section at the new position
        setSections(updatedSections); // Update the state
    };


    const handleSort = () => {
        const reorderedCategories = [...sections];
        const draggedItem = reorderedCategories[dragCategory.current];
        reorderedCategories.splice(dragCategory.current, 1);
        reorderedCategories.splice(draggedOverCategory.current, 0, draggedItem);
        setSections(reorderedCategories);
        let serverPayload = reorderedCategories.map((section, index) => { return { id: section.id, index_number: index } })
        console.log(serverPayload)
        setDraggingIndex(null); // Reset dragging state
    };

    const handleDragEnter = (index) => {
        setHoveredIndex(index); // Set the hovered category index
        draggedOverCategory.current = index; // Store the index of the category being dragged over
    };

    const handleDragLeave = () => {
        setHoveredIndex(null); // Reset hovered index when leaving a category
    };

    const handleDragStart = (index) => {
        dragCategory.current = index; // Save dragged category index
        setDraggingIndex(index); // Update the dragging index
        setDraggingIndex(index); // Set the dragged category index

    };



    const handleDragOver = (e) => {
        e.preventDefault(); // Allow dragging over
        e.stopPropagation();
    };

    // const handleDragEnd = () => {
    //     setDraggingIndex(null); // Reset dragging state when drag ends
    // };


    const toggleItemMenu = (itemId) => {
        setOpenItemMenu(openItemMenu === itemId ? null : itemId);
    };

    const toggleCategoryMenu = (categoryId) => {
        setOpenMenu(openMenu === categoryId ? null : categoryId);
    };

    const toggleFormVisibility = (sectionId) => {
        setIsFormVisible(!isFormVisible);
        setSelectedSectionId(sectionId);

    };
    const toggleAddFormVisibility = () => {
        setIsAddFormVisible(!isAddFormVisible);
    };
    const toggleCategoryItems = (categoryId) => {
        setExpandedCategories((prevState) => ({
            ...prevState,
            [categoryId]: !prevState[categoryId],
        }));
    };
    const deleteSectionApi = async (sectionId) => {
        try {
            const response = await fetch(`http://localhost:234/api/section/${sectionId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                console.log('Section deleted successfully');
                setSectionToDelete(null);
                toast.success("Section Deleted Successfully")
                getSections(m_id)

            } else {
                console.error('Failed to delete section:', response.statusText);
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
            const response = await fetch(`http://localhost:234/api/items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete item');
            }

            // 1. Optimistic UI Update (immediate visual feedback)
            setOfferItems(prev => prev.filter(item => item.id !== itemId));

            // 2. Show success message
            toast.success("تم الحذف بنجاح");
            setActiveItemMoreIndex(null)
            setActiveOfferMoreIndex(null)

            // 3. Refresh data from server (to ensure consistency)
            await getSections(m_id);
            const { items } = await getOfferSectionWithItems(m_id);
            setOfferItems(items);

        } catch (error) {
            console.error('Error deleting item:', error);
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

        const nameRegex = /^.{1,45}$/;

        if (!categoryName) {
            toast.error('يجب اضافة اسم للقسم');
            return;
        } else if (!nameRegex.test(categoryName)) {
            toast.error('الاسم يجب أن لا يتجاوز 45 حرف');
            return;
        }

        if (categoryDescription.length > 500) {
            toast.error("الوصف يجب ان لا يزيد عن 500 حرف");
            return;
        }

        if (sectionFile) {
            const maxSize = 3 * 1024 * 1024; // 3MB
            if (sectionFile.size > maxSize) {
                toast.error('حجم الملف لا يمكن أن يتجاوز 3MB');
                return;
            }
        }

        const stateObject = {
            menu_id: m_id,
            name: categoryName,
            note: categoryDescription
        };

        try {
            // Await the API call to ensure completion
            await addSectionApi(stateObject, sectionFile);
            // Fetch the updated sections after adding the new section
            await getSections(m_id);
            // Clear the input fields
            setCategoryName('');
            setCategoryDescription('');
            setSectionFile(null);
            setPreview(null)
        } catch (error) {
            console.error('Error adding section:', error);
            toast.error('حدث خطأ أثناء إضافة القسم');
        }
    };



    const addSectionApi = async (stateObject, file) => {


        const serverPayload = file ? createFormData(stateObject, file, "cover_image") : stateObject;


        const response = await axios.post('http://localhost:234/api/section', serverPayload);
        console.log(response)
        toast.success('تم الأضافة بنجاح');
        toggleAddFormVisibility()


    }








    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (!selectedFile) {
            return;
        }



        setSectionFile(selectedFile); // Storing file in state
        setItemFile(selectedFile); // Storing file in state

        console.log(selectedFile);

        createPreview(selectedFile); // Update the preview

    };

    const createPreview = (file) => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => setPreview(reader.result);
    };
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
            await axios.post("http://localhost:234/api/contacts", {
                menu_id: m_id,
                phones, // Sending all phone numbers
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
                        className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-red-500 mx-auto"
                    ></div>

                </div>



            </div>

        </>

        ) : scratchMenu || sections.length > 0 ? (<div dir='rtl' onClick={handleMoreClose} className="menu-management min-h-screen relative pb-20 flex flex-col items-center">
            <Toaster></Toaster>
            <div className={`edit-section-form  fixed p-3 rounded-s-lg z-20 md:top-36 left-0 bottom-0 lg:w-1/3 md:w-1/2 w-full top-0   bg-white shadow-xl border-2 transition-all duration-500 ease-in-out 
                ${isFormVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}
            >
                <div className="section-name  p-3 flex gap-2 items-center">
                    <i onClick={toggleFormVisibility} className="close-form cursor-pointer  fa-solid fa-x cairo text-gray-500"></i> <p className='font-medium cairo'>تعديل القسم</p>
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
                            placeholder="Describe your category here ..."
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
                    </div>

                </div>
                <div className="edit-action flex justify-end items-center px-6 gap-3 absolute border shadow-lg bottom-0 left-0 right-0 h-14 bg-white">
                    <button onClick={toggleFormVisibility} className=' close-form py-2 px-4 bg-gray-200 rounded-md'>Cancel </button>
                    <button onClick={handleUpdateSection} className='py-2 px-6 rounded-md text-white bg-green-600'>Save</button>



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

            <div className={`add-section-form fixed p-3 rounded-s-lg md:z-20 z-30 md:top-36 left-0 bottom-0 lg:w-1/3 md:w-1/2 w-full top-0   bg-white shadow-xl border-2 transition-all duration-500 ease-in-out ${isAddFormVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'} `} >
                <div className="section-name  p-3 flex gap-2 items-center">
                    <i onClick={toggleAddFormVisibility} className="close-form cursor-pointer  fa-solid fa-x text-gray-500"></i> <p className='font-medium'>Add New Section</p>
                </div>
                <hr className='w-full ' />
                <form onSubmit={addSection}>
                    <div className="edit-section px-2 mt-4">
                        <div className="category-name">
                            <p className='text-sm'><span><i className="fa-solid fa-asterisk text-red-500 text-sm"></i></span> Name</p>
                            <input className='w-full text-sm p-1 mt-2 rounded-md border-2 h-9' type="text" placeholder="Category name" name="category-name" id="category-name" value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}  // Update category name state
                            />

                        </div>
                        <div className="category-description mt-4">
                            <p className='text-sm'> Description</p>
                            <textarea
                                rows="3"
                                style={{ resize: "none" }}
                                className="w-full text-sm mt-3 p-3 border rounded-md"
                                placeholder="Describe your category ..." value={categoryDescription}
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
                                            <p className='text-sm'> Image</p>
                                            <div className="img border hover:border-dashed hover:border-blue-700 mt-2 w-44 h-44 flex flex-col justify-center items-center px-6 rounded-md bg-slate-100">
                                                <i className="fa-solid fa-arrow-up-from-bracket text-2xl text-blue-500"></i>
                                                <p className='mt-3'>Upload</p>
                                                <p className='text-sm text-gray-500'>Only, jpg, jpeg, png files are supported</p>
                                            </div>


                                        </div>



                                    </>}

                            </div>

                        </label>

                    </div>
                    <div className="edit-action flex justify-end items-center px-6 gap-3 absolute border shadow-lg bottom-0 left-0 right-0 h-14 bg-white">
                        <button onClick={toggleAddFormVisibility} className=' close-form py-2 px-4 bg-gray-200 rounded-md'>Cancel </button>
                        <button type='submit' className='py-2 px-6 rounded-md text-white bg-green-600'>Save</button>



                    </div>
                </form>
            </div>
            {

                isEditItemFormVisible && (
                    <div className={`edit-item-form fixed p-3 rounded-s-lg md:z-20 z-30 md:top-36 left-0 bottom-0 lg:w-1/3 md:w-1/2 w-full top-0 bg-white shadow-xl border-2 transition-all duration-500 ease-in-out `} >
                        <div className="item-name  p-3 flex gap-2 items-center">
                            <i onClick={closeEditItemForm} className="close-form cursor-pointer  fa-solid fa-x text-gray-500"></i> <p className='font-medium'>Edit item</p>
                        </div>
                        <hr className='w-full ' />

                        <div className="overflow-y-scroll h-5/6">
                            <form onSubmit={handleUpdateItem} >


                                <div className="flex bg-white mb-4 border-b border-gray-200 pt-2  ">
                                    <div
                                        className={itemTab("details")}
                                        onClick={() => setActiveItemEditor("details")}
                                    >
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
                                                placeholder="Item name"
                                                value={selectedItem?.name || ""}
                                                onChange={(e) =>
                                                    setSelectedItem((prev) => ({ ...prev, name: e.target.value }))
                                                }

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
                                                placeholder="Describe your item ..."
                                                value={selectedItem?.description || ""}
                                                onChange={(e) =>
                                                    setSelectedItem((prev) => ({ ...prev, description: e.target.value }))
                                                }

                                            ></textarea>
                                        </div>
                                        <div className="item-image">
                                            <p className='text-sm'>Image</p>
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
                                            <p className="text-[#1b5067] text-lg font-medium">Prices</p>
                                            <div className="price-instructions mb-4">
                                                <p className="text-xs leading-5 text-gray-500">
                                                    Items can have price options according to their sizes, servings etc.
                                                    If the item has one price option, you can leave the name blank.
                                                </p>
                                            </div>

                                            <div className="add-new-price-btn">
                                                {selectedItem.item_prices && selectedItem.item_prices.length > 0 ? (
                                                    [...selectedItem.item_prices].sort((a, b) => new Date(a.id) - new Date(b.id))
                                                        .map((price, index) => (
                                                            <div className="new-price flex gap-4 items-end mb-4" key={index}>
                                                                <div className="add-price-name">
                                                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                                                        Name
                                                                    </label>
                                                                    <input
                                                                        className="rounded-md w-44 h-9 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        placeholder="Small"
                                                                        type="text"
                                                                        value={price.label || ''}
                                                                        onChange={(e) => handlePriceChange(index, 'label', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="add-price-price">
                                                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                                                        Price
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
                                                    <p className="text-gray-500 text-sm mb-4">No prices added yet</p>
                                                )}

                                                <button
                                                    className="flex gap-2 items-center text-[#2a7696] hover:text-[#1b5067] mt-2"
                                                    onClick={addPrice}
                                                >
                                                    <i className="fa-solid fa-plus"></i>
                                                    Add Price
                                                </button>
                                            </div>
                                        </div>

                                        <hr className="mt-2" />

                                        <div className="extras-labels mt-5">
                                            <p className="text-[#1b5067] text-lg font-medium">Extras</p>
                                            <div className="extra-instructions mb-4">
                                                <p className="text-xs leading-5 text-gray-500">
                                                    Items can have Extra options. If the item has one Extra option, you
                                                    can't leave the name blank.
                                                </p>
                                            </div>

                                            <div className="add-new-extra-btn">
                                                {extras && extras.length > 0 ? (
                                                    [...extras].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map((extra, index) => (
                                                        <div className="new-extra flex gap-4 items-end mb-4" key={index}>
                                                            <div className="add-extra-name">
                                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                                    Name
                                                                </label>
                                                                <input
                                                                    className="rounded-md w-44 h-9 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    placeholder="Add Cheese"
                                                                    type="text"
                                                                    value={extra.label || ''}
                                                                    onChange={(e) => handleExtraChange(index, 'label', e.target.value)}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="add-extra-price">
                                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                                    Price
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
                                                    <p className="text-gray-500 text-sm mb-4">No extras added yet</p>
                                                )}

                                                <div className="flex justify-between mt-6">
                                                    <button
                                                        className="flex gap-2 items-center text-[#2a7696] hover:text-[#1b5067]"
                                                        onClick={addExtra}
                                                    >
                                                        <i className="fa-solid fa-plus"></i>
                                                        Add Extra
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
                                    <button type="submit" className="py-2 px-6 rounded-md text-white bg-green-600">
                                        Save
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                )
            }
            {

                isEditOfferFormVisible && (
                    <div className={`edit-item-form fixed p-3 rounded-s-lg md:z-20 z-30 md:top-36 left-0 bottom-0 lg:w-1/3 md:w-1/2 w-full top-0 bg-white shadow-xl border-2 transition-all duration-500 ease-in-out `} >
                        <div className="item-name  p-3 flex gap-2 items-center">
                            <i onClick={closeEditOfferForm} className="close-form cursor-pointer  fa-solid fa-x text-gray-500"></i> <p className='font-medium'>تعديل العرض</p>
                        </div>
                        <hr className='w-full ' />

                        <div className="overflow-y-scroll h-5/6">
                            <form onSubmit={handleUpdateItem} >


                                <div className="flex bg-white mb-4 border-b border-gray-200 pt-2  ">
                                    <div
                                        className={itemTab("details")}
                                        onClick={() => setActiveItemEditor("details")}
                                    >
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
                                                placeholder="Item name"
                                                value={selectedItem?.name || ""}
                                                onChange={(e) =>
                                                    setSelectedItem((prev) => ({ ...prev, name: e.target.value }))
                                                }

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
                                                placeholder="Describe your item ..."
                                                value={selectedItem?.description || ""}
                                                onChange={(e) =>
                                                    setSelectedItem((prev) => ({ ...prev, description: e.target.value }))
                                                }

                                            ></textarea>
                                        </div>
                                        <div className="item-image">
                                            <p className='text-sm'>Image</p>
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
                                            <p className="text-[#1b5067] text-lg font-medium">Prices</p>
                                            <div className="price-instructions mb-4">
                                                <p className="text-xs leading-5 text-gray-500">
                                                    Items can have price options according to their sizes, servings etc.
                                                    If the item has one price option, you can leave the name blank.
                                                </p>
                                            </div>

                                            <div className="add-new-price-btn">
                                                {selectedItem.item_prices && selectedItem.item_prices.length > 0 ? (
                                                    [...selectedItem.item_prices].sort((a, b) => new Date(a.id) - new Date(b.id))
                                                        .map((price, index) => (
                                                            <div className="new-price flex gap-4 items-end mb-4" key={index}>
                                                                <div className="add-price-name">
                                                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                                                        Name
                                                                    </label>
                                                                    <input
                                                                        className="rounded-md w-44 h-9 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        placeholder="Small"
                                                                        type="text"
                                                                        value={price.label || ''}
                                                                        onChange={(e) => handlePriceChange(index, 'label', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="add-price-price">
                                                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                                                        Price
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
                                                    <p className="text-gray-500 text-sm mb-4">No prices added yet</p>
                                                )}

                                                <button
                                                    className="flex gap-2 items-center text-[#2a7696] hover:text-[#1b5067] mt-2"
                                                    onClick={addPrice}
                                                >
                                                    <i className="fa-solid fa-plus"></i>
                                                    Add Price
                                                </button>
                                            </div>
                                        </div>

                                        <hr className="mt-2" />

                                        <div className="extras-labels mt-5">
                                            <p className="text-[#1b5067] text-lg font-medium">Extras</p>
                                            <div className="extra-instructions mb-4">
                                                <p className="text-xs leading-5 text-gray-500">
                                                    Items can have Extra options. If the item has one Extra option, you
                                                    can't leave the name blank.
                                                </p>
                                            </div>

                                            <div className="add-new-extra-btn">
                                                {extras && extras.length > 0 ? (
                                                    [...extras].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map((extra, index) => (
                                                        <div className="new-extra flex gap-4 items-end mb-4" key={index}>
                                                            <div className="add-extra-name">
                                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                                    Name
                                                                </label>
                                                                <input
                                                                    className="rounded-md w-44 h-9 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    placeholder="Add Cheese"
                                                                    type="text"
                                                                    value={extra.label || ''}
                                                                    onChange={(e) => handleExtraChange(index, 'label', e.target.value)}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="add-extra-price">
                                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                                    Price
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
                                                    <p className="text-gray-500 text-sm mb-4">No extras added yet</p>
                                                )}

                                                <div className="flex justify-between mt-6">
                                                    <button
                                                        className="flex gap-2 items-center text-[#2a7696] hover:text-[#1b5067]"
                                                        onClick={addExtra}
                                                    >
                                                        <i className="fa-solid fa-plus"></i>
                                                        Add Extra
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
                                    <button type="submit" className="py-2 px-6 rounded-md text-white bg-green-600">
                                        Save
                                    </button>
                                </div>
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
                                            placeholder="اضف وصف لمنتجك ..."
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
            {isAddOfferFormVisible && (
                <div className={`add-offer-form fixed p-3 rounded-s-lg md:z-20 z-30 md:top-36 left-0 bottom-0 lg:w-1/3 md:w-1/2 w-full top-0 bg-white shadow-xl border-2 transition-all duration-500 ease-in-out ${isAddOfferFormVisible
                    ? "opacity-100 translate-x-0 pointer-events-auto"
                    : "opacity-0 translate-x-full pointer-events-none"
                    }`} >
                    <div className="offer-name  p-3 flex gap-2 items-center">
                        <i onClick={closeAddItemForm} className="close-form cursor-pointer  fa-solid fa-x text-gray-500"></i> <p className='font-medium cairo'>اضافة عرض جديد</p>
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
                    <div className="confirm-delete-modal fixed flex justify-center pt-32 inset-0 bg-black/20 z-40">

                        <div className="confirm-delete-form w-1/4 h-fit p-8 flex flex-col justify-center items-center animate-slide-down  bg-white rounded-md shadow-lg">
                            <i className="text-gray-500 text-3xl fa-regular fa-trash-can"></i>
                            <p>are you sure you need to delete Category: <strong>{sectionToDelete.name}</strong> </p>
                            <div className="action-btns flex gap-2 mt-4 ">
                                <button onClick={() => deleteSectionApi(sectionToDelete.id)} className='bg-red-500 text-white text-sm rounded-sm     py-2 px-4'>Yes, Im sure</button>
                                <button onClick={handleCloseDeleteModal} className='bg-slate-50 border text-sm rounded-sm     py-2 px-4'>No, Cancel</button>

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
                        className={sectionTab("pay")}
                        onClick={() => setActiveSectionEditor("pay")}
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
                                    checked={menuData?.is_active || false}
                                    onChange={async () => {
                                        try {
                                            const newStatus = !menuData?.is_active;
                                            await axios.post(`http://localhost:234/api/menu/update/${menu_id}`, {
                                                is_active: newStatus
                                            });
                                            setMenuData(prev => ({ ...prev, is_active: newStatus }));
                                            toast.success(newStatus ? "Menu activated" : "Menu deactivated");
                                        } catch (error) {
                                            toast.error("Failed to update menu status");
                                            console.error("Error updating menu status:", error);
                                        }
                                    }}
                                />
                                <div className={`
      group peer rounded-full duration-300 w-8 h-4 ring-2 
      ${menuData?.is_active ? 'bg-green-500 ring-green-300' : 'bg-gray-300 ring-gray-300'}
      after:duration-300 after:bg-white after:rounded-xl after:absolute 
      after:h-4 after:w-4 after:top-1 after:left-0 
      after:flex after:justify-center after:items-center
      ${menuData?.is_active ? 'after:translate-x-4' : ''}
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

                        <div onClick={toggleAddFormVisibility} className="add-category hover:bg-slate-50 cursor-pointer hover:shadow-md mt-4 shadow-sm flex justify-between bg-white p-3 rounded-lg">
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
                                                    toggleFormVisibility(section.id);
                                                    toggleCategoryItems(section.id);
                                                    toggleCategoryMenu();
                                                    setSelectedSection(section);

                                                }}
                                                className="category-parent cursor-pointer hover:bg-slate-50 shadow-lg flex justify-between p-3 bg-white rounded-lg"
                                            >
                                                <div className="left flex items-center gap-2">

                                                    <div className="flex flex-col mr-2">
                                                        <i
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                moveSectionUp(section.id);
                                                            }}
                                                            className={`fa-solid fa-chevron-up text-xs ${index === 0 ? 'text-gray-300 cursor-default' : 'text-gray-500 hover:text-gray-700 cursor-pointer'
                                                                }`}
                                                        ></i>
                                                        <i
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                moveSectionDown(section.id);
                                                            }}
                                                            className={`fa-solid fa-chevron-down text-xs ${index === sections.length - 1 ? 'text-gray-300 cursor-default' : 'text-gray-500 hover:text-gray-700 cursor-pointer'
                                                                }`}
                                                        ></i>
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
                                                                try {
                                                                    const newStatus = !section.is_available;
                                                                    await axios.post(`http://localhost:234/api/section/update/${section.id}`, {
                                                                        is_available: newStatus
                                                                    });
                                                                    // Update local state
                                                                    setSections(prev => prev.map(s =>
                                                                        s.id === section.id ? { ...s, is_available: newStatus } : s
                                                                    ));
                                                                    toast.success(newStatus ? "Section activated" : "Section deactivated");
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
                                                    <div className="more relative">
                                                        <i onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMoreClick(index); // Toggle the "more" menu for this section
                                                        }} className="fa-solid px-2 text-slate-700 fa-ellipsis-vertical"></i>
                                                        {activeMoreIndex === index && (
                                                            <div className="dropdn absolute md:-right-20 -right-11  z-10 w-32 h-fit border bg-white rounded-md">
                                                                <p className='text-sm flex gap-2 items-center border-b-2 border-slate-400/25 hover:bg-gray-100 p-2'><i className=" text-gray-500 fa-solid fa-clone"></i> dupplicate</p>
                                                                <p onClick={(e) => {
                                                                    e.stopPropagation(); // Prevent parent click events
                                                                    handleDeleteClick(section); // Call the delete handler
                                                                }} className='text-sm flex gap-2 items-center border-b-2 border-slate-400/25 hover:bg-gray-100 p-2'><i className="text-gray-500 fa-regular fa-trash-can"></i> Delete</p>

                                                            </div>
                                                        )}
                                                    </div>

                                                    <i
                                                        className="fa-solid fa-chevron-down cursor-pointer transform transition-transform duration-300"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleCategoryItems(section.id);
                                                        }}
                                                    ></i>
                                                </div>
                                            </div>

                                            <div
                                                className="category-items flex flex-col items-end overflow-hidden transition-max-height duration-500 ease-in-out"
                                                style={{ maxHeight: expandedCategories[section.id] ? '500px' : '0px' }}
                                            >
                                                {filterItems(section.items).map((item, itemIndex) => (
                                                    <div
                                                        onClick={() => {
                                                            openEditItemForm(item),
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
                                                            <span className={`text-sm font-medium ${item.is_available ? 'text-green-600' : 'text-red-600'
                                                                }`}>
                                                                {item.is_available ? 'Active' : 'Inactive'}
                                                            </span>                                                    <p className='w-full md:text-base text-sm whitespace-nowrap text-ellipsis overflow-hidden'>{item.name}</p>
                                                        </div>                                                <div className="right flex md:gap-4 gap-2 items-center">
                                                            <div className="price-edit border flex p-1 rounded-md gap-2">
                                                                <p className='md:text-base text-sm'>EGP</p>
                                                                <input dir='ltr' className="md:w-14 w-12 md:text-base text-sm" type="text" value={item?.item_prices?.[0]?.price || "0"} readOnly />
                                                            </div>
                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    className="sr-only peer"
                                                                    checked={item.is_available}
                                                                    onChange={async (e) => {
                                                                        e.stopPropagation();
                                                                        await handleUpdateItemStatus(item.id, !item.is_available);
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


                                                            <div className="more relative">
                                                                <i
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleItemMoreClick(itemIndex);
                                                                    }}
                                                                    className="fa-solid px-2 bg-green-400 text-slate-700 fa-ellipsis-vertical cursor-pointer"
                                                                ></i>

                                                                {activeItemMoreIndex === itemIndex && (
                                                                    <div className="dropdn absolute md:-right-20 -right-11 z-30 w-32 h-fit border bg-white rounded-md shadow-md">
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
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div onClick={() => openAddItemForm(section.id)} className="add-item hover:bg-slate-50 hover:shadow-md cursor-pointer w-[97%] mt-2 shadow-sm flex justify-between bg-white p-3 rounded-lg">
                                                    <p> + Add Item </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))) : (

                                    <div className="empty-sections flex flex-col justify-center items-center">
                                        <i className="fa-solid fa-arrow-up"></i>
                                        <p>No Section add now!</p>

                                    </div>


                                )}
                            </div>
                        )}



                        <p className='cairo text-sky-700 font-semibold text-lg mt-3'>العروض</p>
                        <div className="offer-section">
                            <div className="offer-section-items flex flex-col items-end overflow-hidden transition-max-height duration-500 ease-in-out">
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

                                            <i className="fa-solid fa-bars text-sm text-gray-400"></i>
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
                                            <div className="more relative">
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
                                            </div>
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

                {activeSectionEditor === "pay" && (
                    <div className="social p-4 w-full bg-white">
                        <p className='text-lg font-medium'>Add Your Social Apps</p>

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
            if (type === "scratch") {
                setIsMenuLoading(false)
                setScratchMenu(true);
            }
            if (type === "sample") {
                setSampleMenu(true);
                createSample(m_id); // Call your function here
            }
        }} />)}


    </>
}
