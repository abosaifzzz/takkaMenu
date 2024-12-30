import React, { useEffect, useRef, useState } from 'react';
import { createFormData } from '../../utils'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import def from '../../assets/download.png'


export default function MenuManagement() {


    const [sections, setSections] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [activeMoreIndex, setActiveMoreIndex] = useState(null); // Tracks which "more" menu is active
    const [activeSectionEditor, setActiveSectionEditor] = useState("items");

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

    useEffect(() => {
        async function getSections() {
            try {
                const response = await axios.get('http://localhost:234/api/sections'); // Fetch sections data
                if (response.data) {
                    const sectionsWithImages = await Promise.all(
                        response.data.map(async (section) => {
                            // If a cover_image exists, fetch the image URL
                            if (section.cover_image) {
                                try {
                                    const imageResponse = await axios.get(
                                        `http://localhost:234/api/file/${section.cover_image}`,
                                        { responseType: 'blob' } // Fetch the image as a blob
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

                    setSections(sectionsWithImages); // Update the state with sections including image URLs
                }
            } catch (error) {
                console.error('Error fetching sections:', error);
                toast.error('حدث خطأ أثناء جلب الأقسام');
            }
        }

        getSections();
    }, []);


    const addSectionApi = async (stateObject, file) => {


        const serverPayload = file ? createFormData(stateObject, file, "cover_image") : stateObject;


        const response = await axios.post('http://localhost:234/api/section', serverPayload);
        console.log(response)
        toast.success('تم الأضافة بنجاح');


    }


    const addSection = (event) => {
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
        }

        addSectionApi(stateObject, file)
        window.location.reload(); // Reloads the page after the API call succeeds

    }



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
            // Cleanup the old preview URL
            URL.revokeObjectURL(preview);
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => setPreview(reader.result);
    };
    const handlePreviewClick = (event) => {
        event.stopPropagation(); // Stop the click from triggering file input
    };
    const handleDelete = (event) => {
        event.stopPropagation(); // Stop event propagation to prevent file input from being triggered
        setPreview(null); // Clear the preview
    };

    const sectionTab = (sectionName) =>
        `cursor-pointer py-2 px-2   md:text-xl text-[1rem] cairo font-[650] ${activeSectionEditor === sectionName
            ? "border-b-2  border-[#20617c]"
            : "text-[#20617c] "
        } `;

    return (
        <div onClick={handleMoreClose} className="menu-management h-screen relative pb-20 flex flex-col items-center">
            <Toaster></Toaster>
            <div
                className={`edit-section-form fixed p-3 rounded-s-lg z-20 top-36 right-0 bottom-0 w-1/3 bg-white shadow-xl border-2 transition-all duration-500 ease-in-out 
                ${isFormVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}
            >
                <div className="section-name  p-3 flex gap-2 items-center">
                    <i onClick={toggleFormVisibility} className="close-form cursor-pointer  fa-solid fa-x text-gray-500"></i> <p className='font-medium'>Edit Section</p>
                </div>
                <hr className='w-full ' />
                <div className="edit-section px-2 mt-4">
                    <div className="category-name">
                        <p className='text-sm'><span><i className="fa-solid fa-asterisk text-red-500 text-sm"></i></span> Name</p>
                        <input className='w-full text-sm p-1 mt-2 rounded-md border-2 h-9' type="text" placeholder="Category name" name="categpry-name" id="" />

                    </div>
                    <div className="category-description mt-4">
                        <p className='text-sm'> Description</p>
                        <textarea
                            rows="3"
                            style={{ resize: "none" }}
                            className="w-full text-sm mt-3 p-3 border rounded-md"
                            placeholder="Describe your category here ..."
                        ></textarea>

                    </div>
                    <div className="category-image">
                        <p className='text-sm'> Image</p>
                        <div className="img border hover:border-dashed hover:border-blue-700 mt-2 w-44 h-44 flex flex-col justify-center items-center px-6 rounded-md bg-slate-100">
                            <i className="fa-solid fa-arrow-up-from-bracket text-2xl text-blue-500"></i>
                            <p className='mt-3'>Upload</p>
                            <p className='text-sm text-gray-500'>Only, jpg, jpeg, png files are supported</p>
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
            <div className={`add-section-form fixed p-3 rounded-s-lg md:z-20 z-30 md:top-36 right-0 bottom-0 md:w-1/3 w-full top-0   bg-white shadow-xl border-2 transition-all duration-500 ease-in-out ${isAddFormVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'} `} >
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
                                        <div onClick={handleDelete} className="delete w-full h-full hover:bg-slate-200 cursor-pointer flex justify-center items-center">
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
            <div className="container w-4/5 pt-3">
                {sectionToDelete && (
                    <div className="confirm-delete-modal fixed flex justify-center pt-32 inset-0 bg-black/20 z-40">

                        <div className="confirm-delete-form w-1/4 h-40 flex flex-col justify-center items-center animate-slide-down  bg-white rounded-md shadow-lg">
                            <i className="text-gray-500 text-3xl fa-regular fa-trash-can"></i>
                            <p>are you sure you need to delete <strong>{sectionToDelete.name}</strong> </p>
                            <div className="action-btns flex gap-2 mt-4 ">
                                <button className='bg-red-500 text-white text-sm rounded-sm     py-2 px-4'>Yes, Im sure</button>
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
                                    onDragEnter={() => handleDragEnter(index)} // Handle category hover
                                    onDragLeave={handleDragLeave} // Reset hovered category
                                    onDragOver={handleDragOver} // Allow dragging over
                                    onDragEnd={handleSort} // Handle sorting after drag
                                    style={{
                                        borderTop: hoveredIndex === index ? '2px dashed #4CAF50' : '', // Highlight target category with a dashed border
                                        transition: 'border 0.3s ease', // Smooth transition for visual effects
                                        transform: draggingIndex === index ? 'scale(1.05)' : '', // Slightly enlarge dragged category
                                        boxShadow: draggingIndex === index ? '0 4px 10px rgba(0, 0, 0, 0.2)' : '', // Add shadow to dragged category
                                    }}
                                >
                                    <div
                                        onClick={() => {
                                            toggleFormVisibility();
                                            toggleCategoryItems(section.id);
                                            toggleCategoryMenu();
                                        }}
                                        draggable
                                        onDragStart={() => handleDragStart(index)} // Capture dragged category index
                                        className="category-parent cursor-pointer hover:bg-slate-50 shadow-lg flex justify-between p-3 bg-white rounded-lg"
                                    >
                                        <div className="left flex items-center gap-2">
                                            {/* Drag button now only has draggable functionality */}
                                            <i className="drag-btn fa-solid fa-bars text-sm text-gray-400 cursor-grab"></i>
                                            {/* Placeholder for category image */}
                                            <img className="w-10 h-10 rounded-md" src={section.cover_image_url ? section.cover_image_url : def} alt='' />

                                            <p>{section.name}</p>
                                        </div>
                                        <div className="right flex gap-4 items-center">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" value="" />
                                                <div className="group peer bg-gray-300 rounded-full duration-300 w-8 h-4 ring-2 ring-gray-300 peer-checked:bg-green-500 after:duration-300 after:bg-white peer-checked:after:bg-white  after:rounded-xl after:absolute after:h-4 after:w-4 after:top-0 after:left-0 after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-hover:after:scale-95"></div>
                                            </label>
                                            {/* Category Menu Actions */}
                                            <div className="more relative">
                                                <i onClick={(e) => {
                                                    e.stopPropagation(); // Prevent closing the menu when clicking inside it
                                                    handleMoreClick(index); // Toggle the "more" menu for this section
                                                }} className="fa-solid px-2 text-slate-700 fa-ellipsis-vertical"></i>
                                                {activeMoreIndex === index && (
                                                    <div className="dropdn absolute -right-20 z-10 w-32 h-fit border bg-white rounded-md">
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
                                            <div key={item.id} className="item p-2 mt-2 rounded-md w-[97%] flex justify-between bg-white">
                                                <div className="left flex items-center gap-2">
                                                    <i className="fa-solid fa-bars text-sm text-gray-400"></i>
                                                    {/* Placeholder for item image */}
                                                    <img
                                                        className="w-7 h-7 rounded-md"
                                                        src={item.image ? item.image : def}
                                                        alt={item.name}
                                                    />
                                                    <p>{item.name}</p>
                                                </div>
                                                <div className="right flex gap-4 items-center">
                                                    <div className="price-edit border flex p-1 rounded-md gap-2">
                                                        <p>EGP</p>
                                                        {/* Placeholder for item price input */}
                                                        <input className="w-14" type="text" value="5000" readOnly />
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" value="" />
                                                        <div className="group peer bg-gray-300 rounded-full duration-300 w-8 h-4 ring-2 ring-gray-300 peer-checked:bg-green-500 after:duration-300 after:bg-white peer-checked:after:bg-white  after:rounded-xl after:absolute after:h-4 after:w-4 after:top-0 after:left-0 after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-hover:after:scale-95"></div>
                                                    </label>
                                                    <i className="fa-solid px-2 text-slate-700 fa-ellipsis-vertical"></i>

                                                </div>
                                            </div>
                                        ))}
                                        <div className="add-item hover:bg-slate-50 hover:shadow-md cursor-pointer w-[97%] mt-2 shadow-sm flex justify-between bg-white p-3 rounded-lg">
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



            </div>
        </div >
    );
}
