import { BaseComponent, ComponentStructure, BaseProperty } from "./types";

import ParagraphInput from "./BaseComponents/ParagraphInput";
import Paragraph from "./BaseComponents/Paragraph";
import { EditorState } from "draft-js";
import StringInput from "./BaseComponents/StringInput";
import StringRender from "./BaseComponents/StringRender";
import Ribbon from "./Templates/Ribbon";
import RibbonCard from "./Templates/RibbonCard";
import SmallRibbonCard from "./Templates/SmallRibbonCard";
import Card from "./Templates/Card";
import ImageCard from "./Templates/ImageCard";
import TitleCard from "./Templates/TitleCard";
import AccordionCard from "./Templates/AccordionCard";
import AccordionStackItem from './Templates/AccordionStackCard';
import CheckList from "./Templates/CheckList/CheckList";
import CheckListSummary from "./Templates/CheckList/CheckListSummary";
import CheckListCriteria from "./Templates/CheckList/CheckListCriteria";
import CheckListItem from "./Templates/CheckList/CheckListItem";
import SectionCard from "./Templates/SectionCard/SectionCard";
import SectionMainBanner from "./Templates/SectionCard/SectionMainBanner";
import SectionSubBanner from "./Templates/SectionCard/SectionSubBanner";
import Link from "./Templates/Link";
import Table from "./Templates/Table/Table";
import TableRow from "./Templates/Table/TableRow";
import TableColumn from "./Templates/Table/TableColumn";
import BooleanInput from "./BaseComponents/BooleanInput";
import BooleanRender from "./BaseComponents/BooleanRender";
import DropdownRender from "./BaseComponents/DropdownRender";
import makeDropdownInput from "./BaseComponents/DropdownInput";

// Reworked components
import BlockSection from "./Templates/BlockSection";
import CardGroup from "./Templates/CardGroup";
import Column from "./Templates/Column";
import Columns from "./Templates/Columns";
import Text from "./Templates/Text";
import Image from "./Templates/Image";

const config = {
  generateDefaultValue: (type: BaseProperty): any => {
    if (typeof type === 'object' || type === 'component') {
      return [];
    } else if (type === 'string') {
      return '';
    } else if (type === 'paragraph') { 
      return EditorState.createEmpty();
    } else {
      throw new TypeError(`Could not generate default value for unknown property type "${type}"`);
    }
  },
  baseInputs: [
    {
      name: 'paragraph',
      inputComponent: ParagraphInput,
      renderComponent: Paragraph,
      defaultValue: EditorState.createEmpty()
    },
    {
      name: 'string',
      inputComponent: StringInput,
      renderComponent: StringRender,
      defaultValue: ''
    },
    {
      name: 'boolean',
      inputComponent: BooleanInput,
      renderComponent: BooleanRender,
      defaultValue: false
    },
    {
      name: 'dropdown-section',
      inputComponent: makeDropdownInput(["banner", "section", "subsection", "accordian"]),
      renderComponent: DropdownRender,
      defaultValue: 'banner'
    }
  ] as BaseComponent<any>[],
  componentStructures: [
    // Start reworked components
    {
      id: 'blockSection',
      component: BlockSection,
      name: 'Section',
      propertyTypes: {
        title: 'string',
        mode: 'dropdown-section',
        children: 'component',
      }
    },
    {
      id: 'cardGroup',
      component: CardGroup,
      name: 'Card Group',
      propertyTypes: {
        children: 'component'
      }
    },
    {
      id: 'column',
      component: Column,
      name: 'Column',
      propertyTypes: {
        children: 'component'
      }
    },
    {
      id: 'columns',
      component: Columns,
      name: 'Column Layout',
      propertyTypes: {
        children: 'component'
      }
    },
    {
      id: 'text',
      component: Text,
      name: 'Text Area',
      propertyTypes: {
        text: 'paragraph'
      }
    },
    {
      id: 'image',
      component: Image,
      name: 'Image',
      propertyTypes: {
        url: 'string'
      }
    }
    // ,

    // {
    //   id: 'ribbon',
    //   component: Ribbon,
    //   name: 'Ribbon',
    //   propertyTypes: {
    //     children: 'string'
    //   }
    // },
    // {
    //   id: 'ribbon-card',
    //   component: RibbonCard,
    //   name: 'Ribbon Card',
    //   propertyTypes: {
    //     title: 'string',
    //     children: 'component'
    //   }
    // },
    // {
    //   id: 'small-ribbon-card',
    //   component: SmallRibbonCard,
    //   name: 'Small Ribbon Card',
    //   propertyTypes: {
    //     title: 'string',
    //     children: 'component'
    //   }
    // },
    // {
    //   id: 'basic-card',
    //   component: Card,
    //   name: 'Basic Card',
    //   propertyTypes: {
    //     children: {
    //       allowed: ['Paragraph', 'Check List']
    //     }
    //   }
    // },
    // {
    //   id: 'image-card',
    //   component: ImageCard,
    //   name: 'Image Card',
    //   propertyTypes: {
    //     url: 'string',
    //     children: 'string'
    //   }
    // },
    // {
    //   id: 'title-card',
    //   component: TitleCard,
    //   name: 'Title Card',
    //   propertyTypes: {
    //     title: 'string',
    //     children: 'string'
    //   }
    // },
    // {
    //   id: 'accordion-card',
    //   component: AccordionCard,
    //   name: 'Accordion Card',
    //   propertyTypes: {
    //     dropdown: 'boolean',
    //     title: 'string',
    //     children: 'string'
    //   }
    // },
    // {
    //   component: AccordionStackItem,
    //   name: 'Accordion Stack Item',
    //   propertyTypes: {
    //     title: 'string',
    //     children: 'component'
    //   }
    // },
    // {
    //   component: CheckList,
    //   name: 'Check List',
    //   propertyTypes: {
    //     children: {
    //       custom: [
    //         {
    //           id: 'check-list-summary',
    //           component: CheckListSummary,
    //           name: 'Check List Summary',
    //           propertyTypes: {
    //             children: 'paragraph'
    //           }
    //         },
    //         {
    //           id: 'check-list-criteria',
    //           component: CheckListCriteria,
    //           name: 'Check List Criteria',
    //           propertyTypes: {
    //             children: {
    //               custom: [
    //                 {
    //                   id: 'check-list-item',
    //                   component: CheckListItem,
    //                   name: 'Check List Item',
    //                   propertyTypes: {
    //                     children: 'string'
    //                   }
    //                 }
    //               ]
    //             }
    //           }
    //         }
    //       ]
    //     }
    //   }
    // },
    // {
    //   id: 'section-card',
    //   component: SectionCard,
    //   name: 'Section',
    //   propertyTypes: {
    //     title: 'string',
    //     children: {
    //       custom: [
    //         {
    //           id: 'main-banner',
    //           component: SectionMainBanner,
    //           name: 'Main Banner',
    //           propertyTypes: {
    //             children: 'string'
    //           }
    //         },
    //         {
    //           id: 'section-subbanner',
    //           component: SectionSubBanner,
    //           name: 'Section Sub Banner',
    //           propertyTypes: {
    //             children: 'string',
    //           }
    //         }
    //       ]
    //     }
    //   }
    // },
    // {
    //   id: 'link',
    //   component: Link,
    //   name: 'Link',
    //   propertyTypes: {
    //     url: 'string',
    //     red: 'boolean',
    //     children: 'string'
    //   }
    // },
    // {
    //   id: 'table',
    //   component: Table,
    //   name: 'Table',
    //   propertyTypes: {
    //     title: 'string',
    //     children: {
    //       custom: [
    //         {
    //           id: 'table-row',
    //           component: TableRow,
    //           name: 'Row',
    //           propertyTypes: {
    //             title: 'string',
    //             children: {
    //               custom: [
    //                 {
    //                   id: 'table-column',
    //                   component: TableColumn,
    //                   name: 'Column',
    //                   propertyTypes: {
    //                     children: 'string'
    //                   }
    //                 }
    //               ]
    //             }
    //           }
    //         }
    //       ]
    //     }
    //   }
    // }
  ] as ComponentStructure[]
}

export default config;
