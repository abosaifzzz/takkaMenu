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





export default function MenuManagement() {


    const [sections, setSections] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [activeMoreIndex, setActiveMoreIndex] = useState(null); // Tracks which "more" menu is active
    const [activeSectionEditor, setActiveSectionEditor] = useState("items");
    const [activeItemEditor, setActiveItemEditor] = useState("details");
    const [prices, setPrices] = useState([]);
    const [extras, setExtras] = useState([]);
    const [phones, setPhones] = useState([]); // First number is default




    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [openMenu, setOpenMenu] = useState(null);
    const [openItemMenu, setOpenItemMenu] = useState(null);
    const [sectionToDelete, setSectionToDelete] = useState(null); // State to track the section being deleted

    const [draggingIndex, setDraggingIndex] = useState(null); // Index of the category being dragged
    const [hoveredIndex, setHoveredIndex] = useState(null); // Index of the category being hovered over
    const dragCategory = useRef(null); // Reference for the dragged category
    const draggedOverCategory = useRef(null); // Reference for the category being dragged over
    const [isAddItemFormVisible, setAddItemFormVisible] = useState(false); // Manage form visibility
    const [selectedSectionId, setSelectedSectionId] = useState(null); // Store the active section ID
    const [selectedSection, setSelectedSection] = useState(null);

    const [isEditItemFormVisible, setIsEditItemFormVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
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
    const { menu_id } = useParams(); // Get menu_id dynamically from the URL


    const fetchPhones = async () => {
        try {
            const response = await axios.get(`http://localhost:234/api/contacts/${menu_id}`);
            if (response.data.length > 0) {
                setPhones(response.data.map(contact => contact.phone)); // Assuming API returns an array of objects with a `phone` field
            } else {
                setPhones([""]); // Default input field if no numbers exist
            }
        } catch (error) {
            console.error("Error fetching phone numbers:", error);
        }
    };


    const fetchLocationAccount = async () => {
        try {
            const response = await axios.get(`http://localhost:234/api/location-account/${menu_id}`);
            if (response.data?.url) {
                setLocationUrl(response.data.url);
                setTempLocationUrl(response.data.url); // Sync temp value
                console.log(tempLocationUrl);

                setIsLocationDisabled(true); // Disable input if URL exists
                setIsUpdateLocation(true); // Show "Update" button
            }
        } catch (err) {
            console.error("Error fetching Location URL:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchInstagramAccount = async () => {
        try {
            const response = await axios.get(`http://localhost:234/api/instagram-account/${menu_id}`);
            if (response.data?.url) {
                console.log(response.data?.url);

                setInstagramUrl(response.data.url);
                setTempInstagramUrl(response.data.url); // Sync temp value
                setIsInstagramDisabled(true); // Disable input if URL exists
                setIsUpdateInstagram(true); // Show "Update" button
            }
        } catch (err) {
            console.error("Error fetching Instagram URL:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFacebookAccount = async (menu_id) => {


        try {
            console.log(menu_id);

            const response = await axios.get(`http://localhost:234/api/facebook-account/${menu_id}`);

            if (response.data && response.data.url) {

                setFacebookUrl(response.data.url);
                setTempFacebookUrl(response.data.url); // Sync temp value
                setIsFacebookDisabled(true); // Disable input if URL exists
                setIsUpdateFacebook(true); // Show "Update" button

            } else {
                console.log("errrrr");

            }
        } catch (err) {
            console.log(err);

        } finally {
            setLoading(false);
        }
    };
    const fetchWhatsappAccount = async (menu_id) => {


        try {

            const response = await axios.get(`http://localhost:234/api/whatsapp-account/${menu_id}`);

            if (response.data && response.data.url) {
                let url = response.data.url;
                let phoneNumber = url.replace("https://wa.me/", "");

                // setFacebookAccount(response.data);
                setWhatsAppUrl(response.data.url);
                setTempWhatsAppUrl(phoneNumber); // Sync temp value
                setIsWhatsAppDisabled(true); // Disable input if URL exists
                setIsUpdateWhatsApp(true); // Show "Update" button            } else {


                // setFacebookAccount(null);
            }
        } catch (err) {
            console.log(err);

            // setFacebookAccount(null);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchWhatsappAccount(menu_id);
        fetchLocationAccount(menu_id);
        fetchPhones(menu_id);

        fetchFacebookAccount(menu_id);
        fetchInstagramAccount(menu_id);


    }, [menu_id]);


    const handleSaveLocationClick = async () => {
        console.log("Saving:", tempLocationUrl);

        try {
            await axios.post("http://localhost:234/api/social", {
                menu_id,
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
            await axios.post("http://localhost:234/api/social", {
                menu_id,
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
            const whatsappNumber = `https://wa.me/${tempWhatsAppUrl}`
            await axios.post("http://localhost:234/api/social", {
                menu_id,
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
            await axios.post("http://localhost:234/api/social", {
                menu_id,
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

    const closeEditItemForm = () => {
        setSelectedItem(null);
        setIsEditItemFormVisible(false);
    };




    async function handleAddItemSubmit(event) {
        event.preventDefault();

        const addItemformData = new FormData(event.target);

        const payload = {
            menu_id: 1,
            section_id: selectedSectionId,
            name: addItemformData.get("item_name"),
            image: preview, // Use the base64 or file URL preview for the image
            description: addItemformData.get("description"),
            item_price: [
                {
                    label: addItemformData.get("price1_label"),
                    price: parseFloat(addItemformData.get("price1_value")),
                },
                {
                    label: addItemformData.get("price2_label"),
                    price: parseFloat(addItemformData.get("price2_value")),
                },
            ],
            item_extras: [
                {
                    name: addItemformData.get("extra1_name"),
                    price: parseFloat(addItemformData.get("extra1_price")),
                },
                {
                    name: addItemformData.get("extra2_name"),
                    price: parseFloat(addItemformData.get("extra2_price")),
                },
            ],
        };

        console.log("Payload to be sent:", payload);

        try {
            const response = await axios.post("http://localhost:234/api/item", payload);
            if (response.status === 201) {
                console.log("Item successfully created:", response.data);
                toast.success("Item created successfully!");
            } else {
                toast.error("Failed to create item. Please try again.");
            }
        } catch (error) {
            console.error("Error creating item:", error);
            toast.error("Error creating item.");
        }
    }


    function handleItemFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result); // Store the base64 string for the image preview
            };
            reader.readAsDataURL(file);
        }
    }


    const openAddItemForm = (sectionId) => {
        setSelectedSectionId(sectionId);
        setAddItemFormVisible(true);
    };
    const closeAddItemForm = () => {
        setSelectedSectionId(null);
        setAddItemFormVisible(false);
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

    const handleDragEnd = () => {
        setDraggingIndex(null); // Reset dragging state when drag ends
    };


    const toggleItemMenu = (itemId) => {
        setOpenItemMenu(openItemMenu === itemId ? null : itemId);
    };

    const toggleCategoryMenu = (categoryId) => {
        setOpenMenu(openMenu === categoryId ? null : categoryId);
    };

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
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
                getSections()

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
    const deleteItem = (categoryId, itemId) => {
        setCategories(categories.map(category => {
            if (category.id === categoryId) {
                return {
                    ...category,
                    items: category.items.filter(item => item.id !== itemId),
                };
            }
            return category;
        }));
    };
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const openModal = (event) => {
        event.stopPropagation();  // Prevent the event from propagating and closing modal on click
        setIsModalOpen(true);
    }; const closeModal = () => setIsModalOpen(false);

    //////////////////////////////////////
    // async function getSections() {
    //     try {
    //         const response = await axios.get('http://localhost:234/api/sections'); // Fetch sections data
    //         console.log(response);

    //         if (response.data) {
    //             const sectionsWithImages = await Promise.all(
    //                 response.data.map(async (section) => {
    //                     // If a cover_image exists, fetch the image URL
    //                     if (section.cover_image) {
    //                         try {
    //                             const imageResponse = await axios.get(
    //                                 `http://localhost:234/api/file/${section.cover_image}`,
    //                                 { responseType: 'blob' } // Fetch the image as a blob
    //                             );
    //                             const imageUrl = URL.createObjectURL(imageResponse.data); // Create a URL for the blob
    //                             return { ...section, cover_image_url: imageUrl }; // Add the URL to the section object
    //                         } catch (imageError) {
    //                             console.error(`Error fetching image for ${section.cover_image}`, imageError);
    //                             return { ...section, cover_image_url: null }; // Fallback to null if image fetch fails
    //                         }
    //                     }
    //                     return { ...section, cover_image_url: null }; // No image case
    //                 })
    //             );
    //             console.log(sectionsWithImages);


    //             setSections(sectionsWithImages); // Update the state with sections including image URLs
    //         }
    //     } catch (error) {
    //         console.error('Error fetching sections:', error);
    //         toast.error('حدث خطأ أثناء جلب الأقسام');
    //         const dummyData = [
    //             {
    //                 id: 15,
    //                 menu_id: 1,
    //                 name: 'fssssssssssaaaaaaaaaaassssssssf',
    //                 note: '',
    //                 badge: null,
    //                 cover_image: null,
    //                 is_available: true,
    //                 is_offer: false,
    //                 items: [],
    //                 cover_image_url: 'blob:http://localhost:5173/ef391261-b773-46e5-b1c4-b44e174bd44f'
    //             },
    //             {
    //                 id: 16,
    //                 menu_id: 1,
    //                 name: 'dsdsd',
    //                 note: '',
    //                 badge: null,
    //                 cover_image: null,
    //                 is_available: true,
    //                 is_offer: false,
    //                 items: [],
    //                 cover_image_url: null
    //             },
    //             {
    //                 id: 17,
    //                 menu_id: 1,
    //                 name: 'Mohamed ',
    //                 note: 'gamed ',
    //                 badge: null,
    //                 cover_image: null,
    //                 is_available: true,
    //                 is_offer: false,
    //                 items: [],
    //                 cover_image_url: 'blob:http://localhost:5173/57972719-e9be-4752-9b36-399961d135b4'
    //             }
    //         ];
    //         setSections(dummyData);
    //     }
    // }
    // useEffect(() => {


    //     getSections();
    // }, []);
    async function getSections(menu_id) {
        try {
            // Fetch sections using menu_id
            const response = await axios.get(`http://localhost:234/api/menusection/${menu_id}`);
            console.log(response);

            if (response.data) {
                const sectionsWithImages = await Promise.all(
                    response.data.map(async (section) => {
                        // If a cover_image exists, fetch the image URL
                        if (section.cover_image) {
                            try {
                                const imageResponse = await axios.get(
                                    `http://localhost:234/api/file/${section.cover_image}`,
                                    { responseType: "blob" } // Fetch the image as a blob
                                );
                                const imageUrl = URL.createObjectURL(imageResponse.data); // Create a URL for the blob
                                return { ...section, cover_image_url: imageUrl }; // Add the URL to the section object
                            } catch (imageError) {
                                console.error(`Error fetching image for ${section.cover_image}`, imageError);
                                return { ...section, cover_image_url: null }; // Fallback to null if image fetch fails
                            }
                        }
                        return { ...section, cover_image_url: null }; // No image case
                    })
                );
                console.log(sectionsWithImages);
                setSections(sectionsWithImages); // Update the state with sections including image URLs
            }
        } catch (error) {
            console.error("Error fetching sections:", error);
            toast.error("حدث خطأ أثناء جلب الأقسام");

            // Fallback dummy data
            const dummyData = [
                {
                    id: 15,
                    menu_id: menu_id,
                    name: "Sample Section 1",
                    note: "",
                    badge: null,
                    cover_image: null,
                    is_available: true,
                    is_offer: false,
                    items: [],
                    cover_image_url: "blob:http://localhost:5173/ef391261-b773-46e5-b1c4-b44e174bd44f",
                },
                {
                    id: 16,
                    menu_id: menu_id,
                    name: "Sample Section 2",
                    note: "",
                    badge: null,
                    cover_image: null,
                    is_available: true,
                    is_offer: false,
                    items: [],
                    cover_image_url: null,
                },
                {
                    id: 17,
                    menu_id: menu_id,
                    name: "Sample Section 3",
                    note: "Note for section 3",
                    badge: null,
                    cover_image: null,
                    is_available: true,
                    is_offer: false,
                    items: [],
                    cover_image_url: "blob:http://localhost:5173/57972719-e9be-4752-9b36-399961d135b4",
                },
            ];
            setSections(dummyData);
        }
    }

    useEffect(() => {

        getSections(menu_id);

    }, [menu_id]); // Runs when menu_id changes



    const addSectionApi = async (stateObject, file) => {


        const serverPayload = file ? createFormData(stateObject, file, "cover_image") : stateObject;


        const response = await axios.post('http://localhost:234/api/section', serverPayload);
        console.log(response)
        toast.success('تم الأضافة بنجاح');


    }


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

        if (file) {
            const maxSize = 3 * 1024 * 1024; // 3MB
            if (file.size > maxSize) {
                toast.error('حجم الملف لا يمكن أن يتجاوز 3MB');
                return;
            }
        }

        const stateObject = {
            menu_id: "1",
            name: categoryName,
            note: categoryDescription
        };

        try {
            // Await the API call to ensure completion
            await addSectionApi(stateObject, file);
            // Fetch the updated sections after adding the new section
            await getSections();
            // Clear the input fields
            setCategoryName('');
            setCategoryDescription('');
            setFile(null);
        } catch (error) {
            console.error('Error adding section:', error);
            toast.error('حدث خطأ أثناء إضافة القسم');
        }
    };





    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (!selectedFile) {
            return;
        }



        setFile(selectedFile); // Storing file in state

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
        setFile(null); // Clear the preview

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
                menu_id,
                phones, // Sending all phone numbers
            });

            toast.success("Phone numbers saved successfully!")
        } catch (error) {
            console.error("Error saving phone numbers:", error);
        }
    };



    const addPrice = () => {
        setPrices([...prices, { name: "", price: "" }]);
    };

    const addExtra = () => {
        setExtras([...extras, { name: "", price: "" }]);
    };
    const deletePrice = (index) => {
        const updatedPrices = prices.filter((_, i) => i !== index);
        setPrices(updatedPrices);
    };

    const deleteExtra = (index) => {
        const updatedExtras = extras.filter((_, i) => i !== index);
        setExtras(updatedExtras);
    };


    return (
        <div onClick={handleMoreClose} className="menu-management min-h-screen relative pb-20 flex flex-col items-center">
            <Toaster></Toaster>
            <div className={`edit-section-form  fixed p-3 rounded-s-lg z-20 md:top-36 right-0 bottom-0 lg:w-1/3 md:w-1/2 w-full top-0   bg-white shadow-xl border-2 transition-all duration-500 ease-in-out 
                ${isFormVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}
            >
                <div className="section-name  p-3 flex gap-2 items-center">
                    <i onClick={toggleFormVisibility} className="close-form cursor-pointer  fa-solid fa-x text-gray-500"></i> <p className='font-medium'>Edit Section</p>
                </div>
                <hr className='w-full ' />
                <div className="edit-section px-2 mt-4">
                    <div className="category-name">
                        <p className='text-sm'><span><i className="fa-solid fa-asterisk text-red-500 text-sm"></i></span> Name</p>
                        <input className='w-full text-sm p-1 mt-2 rounded-md border-2 h-9' type="text" placeholder="Category name" value={selectedSection?.name || ''} // Use selectedSection's name
                            onChange={(e) =>
                                setSelectedSection((prev) => ({ ...prev, name: e.target.value }))
                            }
                        />

                    </div>
                    <div className="category-description mt-4">
                        <p className='text-sm'> Description</p>
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
                        <p className='text-sm'> Image</p>
                        <div className="img border hover:border-dashed hover:border-blue-700 mt-2 w-44 h-44 flex flex-col justify-center items-center px-6 rounded-md bg-slate-100">
                            {selectedSection?.cover_image_url ? (
                                <img
                                    src={selectedSection.cover_image_url}
                                    alt="Selected"
                                    className="w-full h-full object-cover rounded-md"
                                />
                            ) : (
                                <>
                                    <i className="fa-solid fa-arrow-up-from-bracket text-2xl text-blue-500"></i>
                                    <p className="mt-3">Upload</p>
                                    <p className="text-sm text-gray-500">Only jpg, jpeg, png files are supported</p>
                                </>
                            )}
                        </div>


                    </div>

                </div>
                <div className="edit-action flex justify-end items-center px-6 gap-3 absolute border shadow-lg bottom-0 left-0 right-0 h-14 bg-white">
                    <button onClick={toggleFormVisibility} className=' close-form py-2 px-4 bg-gray-200 rounded-md'>Cancel </button>
                    <button className='py-2 px-6 rounded-md text-white bg-green-600'>Save</button>



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

            <div className={`add-section-form fixed p-3 rounded-s-lg md:z-20 z-30 md:top-36 right-0 bottom-0 lg:w-1/3 md:w-1/2 w-full top-0   bg-white shadow-xl border-2 transition-all duration-500 ease-in-out ${isAddFormVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'} `} >
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
                        <button onClick={toggleFormVisibility} className=' close-form py-2 px-4 bg-gray-200 rounded-md'>Cancel </button>
                        <button onClick={toggleAddFormVisibility} type='submit' className='py-2 px-6 rounded-md text-white bg-green-600'>Save</button>



                    </div>
                </form>
            </div>
            {

                isEditItemFormVisible && (
                    <div className={`edit-item-form fixed p-3 rounded-s-lg md:z-20 z-30 md:top-36 right-0 bottom-0 lg:w-1/3 md:w-1/2 w-full top-0 bg-white shadow-xl border-2 transition-all duration-500 ease-in-out `} >
                        <div className="item-name  p-3 flex gap-2 items-center">
                            <i onClick={closeAddItemForm} className="close-form cursor-pointer  fa-solid fa-x text-gray-500"></i> <p className='font-medium'>Edit item</p>
                        </div>
                        <hr className='w-full ' />

                        <div className="overflow-y-scroll h-5/6">
                            <form >


                                <div className="flex bg-white mb-4 border-b border-gray-200 pt-2  ">
                                    <div
                                        className={itemTab("details")}
                                        onClick={() => setActiveItemEditor("details")}
                                    >
                                        Details
                                    </div>


                                    <div
                                        className={itemTab("more")}
                                        onClick={() => setActiveItemEditor("more")}
                                    >
                                        Morerr
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
                                                name="edit_item_name"
                                                className="w-full text-sm p-1 mt-2 rounded-md border-2 h-9"
                                                placeholder="Item name"
                                                value={selectedItem?.name || ""}

                                                required
                                            />
                                        </div>

                                        <div className="category-description mt-4">
                                            <p className="text-sm">Description</p>
                                            <textarea
                                                rows="3"
                                                name="edit_description"
                                                style={{ resize: "none" }}
                                                className="w-full text-sm mt-3 p-3 border rounded-md"
                                                placeholder="Describe your item ..."
                                                value={selectedItem?.description || ""}

                                            ></textarea>
                                        </div>
                                        <div className="item-image mt-4">
                                            <p className="text-sm">Image</p>
                                            <input
                                                type="file"
                                                name="item_image"
                                                accept="image/jpeg, image/png"

                                                className="hidden"
                                                id="edit_item_image_upload"
                                            />
                                            <label htmlFor="edit_item_image_upload">
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
                                            <label className="block mb-3" htmlFor="">
                                                Price
                                            </label>
                                            <input
                                                className="rounded-md w-44 h-9 border-2 px-2"
                                                placeholder="0,00"
                                                type="text"
                                                value={selectedItem.item_prices[0]?.price}


                                            />
                                        </div>




                                    </div>
                                )}

                                {activeItemEditor === "more" && (
                                    <div>
                                        <div className="prices-labels mt-5">
                                            <p className="text-[#1b5067] text-lg font-medium">Prices</p>
                                            <div className="price-instructions mb-4">
                                                <p className="text-xs leading-5 text-gray-500">
                                                    Items can have price options according to their sizes, servings etc.
                                                    If the item has one price option, you can leave the name blank.
                                                </p>
                                            </div>

                                            <div className="add-new-price-btn">
                                                {prices.map((price, index) => (
                                                    <div className="new-price flex gap-2" key={index}>
                                                        <div className="add-price-name mb-3">
                                                            <label className="block mb-3" htmlFor="">
                                                                Name
                                                            </label>
                                                            <input
                                                                className="rounded-md w-44 h-9 px-2 border-2"
                                                                placeholder="Small"
                                                                type="text"
                                                                value={price.name}

                                                            />
                                                        </div>
                                                        <div className="add-price-price">
                                                            <label className="block mb-3" htmlFor="">
                                                                Price
                                                            </label>
                                                            <input
                                                                className="rounded-md w-44 h-9 border-2 px-2"
                                                                placeholder="0,00"
                                                                type="text"
                                                                value={price.price}

                                                            />
                                                        </div>
                                                        <div
                                                            className="delete-price ms-3 mt-5 flex items-center cursor-pointer"
                                                            onClick={() => deletePrice(index)}
                                                        >
                                                            <i className="fa-solid text-gray-600 fa-x"></i>
                                                        </div>
                                                    </div>
                                                ))}

                                                <button
                                                    className="flex gap-2 items-center text-[#2a7696]"
                                                    onClick={addPrice}
                                                >
                                                    <i className="fa-solid fa-plus"></i>
                                                    Add Price
                                                </button>
                                            </div>
                                        </div>

                                        <hr className="mt-2" />

                                        <div className="Extras-labels mt-5">
                                            <p className="text-[#1b5067] text-lg font-medium">Extras</p>
                                            <div className="Extra-instructions mb-4">
                                                <p className="text-xs leading-5 text-gray-500">
                                                    Items can have Extra options. If the item has one Extra option, you
                                                    can't leave the name blank.
                                                </p>
                                            </div>

                                            <div className="add-new-Extra-btn">
                                                {extras.map((extra, index) => (
                                                    <div className="new-Extra flex gap-2" key={index}>
                                                        <div className="add-Extra-name mb-3">
                                                            <label className="block mb-3" htmlFor="">
                                                                Name
                                                            </label>
                                                            <input
                                                                className="rounded-md w-44 h-9 px-2 border-2"
                                                                placeholder="Add Cheese"
                                                                type="text"
                                                                value={extra.name}

                                                            />
                                                        </div>
                                                        <div className="add-Extra-Extra">
                                                            <label className="block mb-3" htmlFor="">
                                                                Price
                                                            </label>
                                                            <input
                                                                className="rounded-md w-44 h-9 border-2 px-2"
                                                                placeholder="0,00"
                                                                type="text"
                                                                value={extra.price}

                                                            />
                                                        </div>
                                                        <div
                                                            className="delete-Extra ms-3 mt-5 flex items-center cursor-pointer"
                                                            onClick={() => deleteExtra(index)}
                                                        >
                                                            <i className="fa-solid text-gray-600 fa-x"></i>
                                                        </div>
                                                    </div>
                                                ))}

                                                <button
                                                    className="flex gap-2 items-center text-[#2a7696]"
                                                    onClick={addExtra}
                                                >
                                                    <i className="fa-solid fa-plus"></i>
                                                    Add Extra
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Submit Buttons */}
                                <div className="edit-action flex justify-end items-center px-6 gap-3 absolute border shadow-lg bottom-0 left-0 right-0 h-14 bg-white">
                                    <button type="button" className="close-form py-2 px-4 bg-gray-200 rounded-md">
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

                <div className={`add-item-form fixed p-3 rounded-s-lg md:z-20 z-30 md:top-36 right-0 bottom-0 lg:w-1/3 md:w-1/2 w-full top-0 bg-white shadow-xl border-2 transition-all duration-500 ease-in-out ${isAddItemFormVisible
                    ? "opacity-100 translate-x-0 pointer-events-auto"
                    : "opacity-0 translate-x-full pointer-events-none"
                    }`} >
                    <div className="item-name  p-3 flex gap-2 items-center">
                        <i onClick={closeAddItemForm} className="close-form cursor-pointer  fa-solid fa-x text-gray-500"></i> <p className='font-medium'>Add New item</p>
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
                                    Details
                                </div>


                                <div
                                    className={itemTab("more")}
                                    onClick={() => setActiveItemEditor("more")}
                                >
                                    More
                                </div>
                            </div>
                            {activeItemEditor === "details" && (
                                <div>

                                    <div className="item-name mt-4">
                                        <label htmlFor="item_name" className="block">
                                            <span className="text-red-500">*</span> Name
                                        </label>
                                        <input
                                            type="text"
                                            name="item_name"
                                            className="w-full text-sm p-1 mt-2 rounded-md border-2 h-9"
                                            placeholder="Item name"
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
                                        ></textarea>
                                    </div>
                                    <div className="item-image mt-4">
                                        <p className="text-sm">Image</p>
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
                                        <label className="block mb-3" htmlFor="">
                                            Price
                                        </label>
                                        <input
                                            className="rounded-md w-44 h-9 border-2 px-2"
                                            placeholder="0,00"
                                            type="text"


                                        />
                                    </div>




                                </div>
                            )}

                            {activeItemEditor === "more" && (
                                <div>
                                    <div className="prices-labels mt-5">
                                        <p className="text-[#1b5067] text-lg font-medium">Prices</p>
                                        <div className="price-instructions mb-4">
                                            <p className="text-xs leading-5 text-gray-500">
                                                Items can have price options according to their sizes, servings etc.
                                                If the item has one price option, you can leave the name blank.
                                            </p>
                                        </div>

                                        <div className="add-new-price-btn">
                                            {prices.map((price, index) => (
                                                <div className="new-price flex gap-2" key={index}>
                                                    <div className="add-price-name mb-3">
                                                        <label className="block mb-3" htmlFor="">
                                                            Name
                                                        </label>
                                                        <input
                                                            className="rounded-md w-44 h-9 px-2 border-2"
                                                            placeholder="Small"
                                                            type="text"
                                                            value={price.name}
                                                            onChange={(e) =>
                                                                updatePrice(index, "name", e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                    <div className="add-price-price">
                                                        <label className="block mb-3" htmlFor="">
                                                            Price
                                                        </label>
                                                        <input
                                                            className="rounded-md w-44 h-9 border-2 px-2"
                                                            placeholder="0,00"
                                                            type="text"
                                                            value={price.price}
                                                            onChange={(e) =>
                                                                updatePrice(index, "price", e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                    <div
                                                        className="delete-price ms-3 mt-5 flex items-center cursor-pointer"
                                                        onClick={() => deletePrice(index)}
                                                    >
                                                        <i className="fa-solid text-gray-600 fa-x"></i>
                                                    </div>
                                                </div>
                                            ))}

                                            <button
                                                className="flex gap-2 items-center text-[#2a7696]"
                                                onClick={addPrice}
                                            >
                                                <i className="fa-solid fa-plus"></i>
                                                Add Price
                                            </button>
                                        </div>
                                    </div>

                                    <hr className="mt-2" />

                                    <div className="Extras-labels mt-5">
                                        <p className="text-[#1b5067] text-lg font-medium">Extras</p>
                                        <div className="Extra-instructions mb-4">
                                            <p className="text-xs leading-5 text-gray-500">
                                                Items can have Extra options. If the item has one Extra option, you
                                                can't leave the name blank.
                                            </p>
                                        </div>

                                        <div className="add-new-Extra-btn">
                                            {extras.map((extra, index) => (
                                                <div className="new-Extra flex gap-2" key={index}>
                                                    <div className="add-Extra-name mb-3">
                                                        <label className="block mb-3" htmlFor="">
                                                            Name
                                                        </label>
                                                        <input
                                                            className="rounded-md w-44 h-9 px-2 border-2"
                                                            placeholder="Add Cheese"
                                                            type="text"
                                                            value={extra.name}
                                                            onChange={(e) =>
                                                                updateExtra(index, "name", e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                    <div className="add-Extra-Extra">
                                                        <label className="block mb-3" htmlFor="">
                                                            Price
                                                        </label>
                                                        <input
                                                            className="rounded-md w-44 h-9 border-2 px-2"
                                                            placeholder="0,00"
                                                            type="text"
                                                            value={extra.price}
                                                            onChange={(e) =>
                                                                updateExtra(index, "price", e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                    <div
                                                        className="delete-Extra ms-3 mt-5 flex items-center cursor-pointer"
                                                        onClick={() => deleteExtra(index)}
                                                    >
                                                        <i className="fa-solid text-gray-600 fa-x"></i>
                                                    </div>
                                                </div>
                                            ))}

                                            <button
                                                className="flex gap-2 items-center text-[#2a7696]"
                                                onClick={addExtra}
                                            >
                                                <i className="fa-solid fa-plus"></i>
                                                Add Extra
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Submit Buttons */}
                            <div className="edit-action flex justify-end items-center px-6 gap-3 absolute border shadow-lg bottom-0 left-0 right-0 h-14 bg-white">
                                <button type="button" onClick={toggleFormVisibility} className="close-form py-2 px-4 bg-gray-200 rounded-md">
                                    Cancel
                                </button>
                                <button type="submit" className="py-2 px-6 rounded-md text-white bg-green-600">
                                    Save
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
                        Menu
                    </div>


                    <div
                        className={sectionTab("pay")}
                        onClick={() => setActiveSectionEditor("pay")}
                    >
                        Social Media
                    </div>
                </div>


                {activeSectionEditor === "items" && (
                    <div>
                        <div className="live-menu shadow-md flex justify-between bg-white p-3 rounded-lg">

                            <p>Live Menu </p>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" value="" />
                                <div className="group peer bg-gray-300 rounded-full duration-300 w-8 h-4 ring-2 ring-gray-300 peer-checked:bg-green-500 after:duration-300 after:bg-white peer-checked:after:bg-white  after:rounded-xl after:absolute after:h-4 after:w-4 after:top-1 after:left-0 after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-hover:after:scale-95"></div>
                            </label>
                        </div>
                        <div className="search shadow-sm mt-4 relative"  >
                            <input className="w-full rounded-lg p-3 pl-10" type="search" placeholder="Search..." />
                            <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>
                        <div onClick={toggleAddFormVisibility} className="add-category hover:bg-slate-50 cursor-pointer hover:shadow-md mt-4 shadow-sm flex justify-between bg-white p-3 rounded-lg">
                            <p> + Add Section </p>
                        </div>

                        <div className="categories mt-6">
                            {sections.length > 0 ? (sections.map((section, index) => (
                                <div
                                    key={section.id}
                                    className={`category mt-2 ${draggingIndex === index ? 'opacity-50' : ''}`}
                                    onDragEnter={() => handleDragEnter(index)}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver}
                                    onDragEnd={handleSort}
                                    style={{
                                        borderTop: hoveredIndex === index ? '2px dashed #4CAF50' : '',
                                        transition: 'border 0.3s ease',
                                        transform: draggingIndex === index ? 'scale(1.05)' : '',
                                        boxShadow: draggingIndex === index ? '0 4px 10px rgba(0, 0, 0, 0.2)' : '',
                                    }}
                                >
                                    <div
                                        onClick={() => {
                                            toggleFormVisibility();
                                            toggleCategoryItems(section.id);
                                            toggleCategoryMenu();
                                            setSelectedSection(section); // Set the selected section data

                                        }}
                                        draggable
                                        onDragStart={() => handleDragStart(index)}
                                        className="category-parent cursor-pointer hover:bg-slate-50 shadow-lg flex justify-between p-3 bg-white rounded-lg"
                                    >
                                        <div className="left flex items-center gap-2">
                                            <div className="drag-btns md:hidden flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (index > 0) {
                                                            handleMoveSection(index, index - 1);
                                                        }
                                                    }}
                                                    className="arrow-btn bg-slate-200 w-6 text-gray-500 hover:text-green-500"
                                                >
                                                    <i className="fa-solid fa-arrow-up"></i>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (index < sections.length - 1) {
                                                            handleMoveSection(index, index + 1);
                                                        }
                                                    }}
                                                    className="arrow-btn bg-slate-200 w-6 text-gray-500 hover:text-green-500"
                                                >
                                                    <i className="fa-solid fa-arrow-down"></i>

                                                </button>
                                            </div>
                                            <i className="drag-btn fa-solid fa-bars md:flex hidden text-sm text-gray-400 cursor-grab"></i>
                                            <img className="w-10 h-10 rounded-md" src={section.cover_image_url ? section.cover_image_url : def} alt='' />

                                            <p className="truncate md:max-w-[400px] sm:max-w-80 max-w-24 text-ellipsis overflow-hidden whitespace-nowrap" > {section.name}</p>
                                        </div>
                                        <div className="right flex gap-4 items-center">


                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" value="" />
                                                <div className="group peer bg-gray-300 rounded-full duration-300 w-8 h-4 ring-2 ring-gray-300 peer-checked:bg-green-500 after:duration-300 after:bg-white peer-checked:after:bg-white  after:rounded-xl after:absolute after:h-4 after:w-4 after:top-0 after:left-0 after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-hover:after:scale-95"></div>
                                            </label>
                                            <div className="more relative">
                                                <i onClick={(e) => {
                                                    e.stopPropagation(); // Prevent closing the menu when clicking inside it
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
                                        {section.items.map((item) => (
                                            <div onClick={() => openEditItemForm(item)} key={item.id} className="item p-2 mt-2 rounded-md w-[97%] flex gap-2 justify-between bg-white">
                                                <div className="left md:w-2/3 w-1/2   flex items-center gap-2">
                                                    <i className="fa-solid fa-bars text-sm text-gray-400"></i>
                                                    {/* Placeholder for item image */}
                                                    <img
                                                        className="w-7 h-7 rounded-md"
                                                        src={item.image ? item.image : def}
                                                        alt={item.name}
                                                    />
                                                    <p className='w-full md:text-base text-sm whitespace-nowrap text-ellipsis overflow-hidden'>{item.name}</p>
                                                </div>
                                                <div className="right flex md:gap-4 gap-2 items-center">
                                                    <div className="price-edit border flex p-1 rounded-md gap-2">
                                                        <p className='md:text-base text-sm'>EGP</p>
                                                        <input className="md:w-14 w-12 md:text-base text-sm" type="text" value={item?.item_prices?.[0]?.price || "0"} readOnly />
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" value="" />
                                                        <div className="group peer bg-gray-300 rounded-full duration-300 md:w-8 w-6 h-3 md:h-4 ring-2 ring-gray-300 peer-checked:bg-green-500 after:duration-300 after:bg-white peer-checked:after:bg-white  after:rounded-xl after:absolute md:after:h-4 after:h-3 md:after:w-4 after:w-3 after:top-0 after:left-0 after:flex after:justify-center after:items-center md:peer-checked:after:translate-x-4 peer-checked:after:translate-x-3 peer-hover:after:scale-95"></div>
                                                    </label>
                                                    <i className="fa-solid px-2 text-slate-700 fa-ellipsis-vertical"></i>

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
        </div >
    );
}
